using backend.Data;
using backend.DTOs.Products;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly TechXpressDbContext _db;
    public CategoriesController(TechXpressDbContext db) => _db = db;

    /// <summary>قائمة مسطّحة (الفرونت يبني الشجرة من ParentCategoryId).</summary>
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> List([FromQuery] bool includeInactive = false)
    {
        var q = _db.Categories.AsNoTracking().AsQueryable();
        if (!(includeInactive && User.IsInRole(Roles.Admin))) q = q.Where(c => c.IsActive);
        return await q.OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.ParentCategoryId, c.IsActive,
                c.Products.Count(p => p.IsActive)))
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var dto = await _db.Categories.AsNoTracking().Where(c => c.Id == id)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.ParentCategoryId, c.IsActive,
                c.Products.Count(p => p.IsActive)))
            .FirstOrDefaultAsync();
        if (dto is null || (!dto.IsActive && !User.IsInRole(Roles.Admin)))
            return NotFound(ApiResponse.Fail("Category not found."));
        return Ok(dto);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create(CategoryUpsertRequest req)
    {
        var error = await ValidateAsync(req, null);
        if (error is not null) return error;

        var slug = await ResolveSlugAsync(req.Slug, req.Name, null);
        if (slug is null) return Conflict(ApiResponse.Fail("A category with this slug already exists."));

        var c = new Category
        {
            Name = req.Name.Trim(),
            Slug = slug,
            ParentCategoryId = req.ParentCategoryId,
            IsActive = req.IsActive,
            CreatedAt = DateTime.UtcNow
        };
        _db.Categories.Add(c);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = c.Id },
            new CategoryDto(c.Id, c.Name, c.Slug, c.ParentCategoryId, c.IsActive, 0));
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CategoryUpsertRequest req)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c is null) return NotFound(ApiResponse.Fail("Category not found."));

        var error = await ValidateAsync(req, id);
        if (error is not null) return error;

        if (!string.IsNullOrWhiteSpace(req.Slug))
        {
            var slug = await ResolveSlugAsync(req.Slug, req.Name, id);
            if (slug is null) return Conflict(ApiResponse.Fail("A category with this slug already exists."));
            c.Slug = slug;
        }
        c.Name = req.Name.Trim();
        c.ParentCategoryId = req.ParentCategoryId;
        c.IsActive = req.IsActive;
        await _db.SaveChangesAsync();

        return Ok(new CategoryDto(c.Id, c.Name, c.Slug, c.ParentCategoryId, c.IsActive,
            await _db.Products.CountAsync(p => p.CategoryId == id && p.IsActive)));
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c is null) return NotFound(ApiResponse.Fail("Category not found."));
        if (await _db.Products.AnyAsync(p => p.CategoryId == id))
            return Conflict(ApiResponse.Fail("Category still has products. Move or delete them first."));
        if (await _db.Categories.AnyAsync(x => x.ParentCategoryId == id))
            return Conflict(ApiResponse.Fail("Category has sub-categories. Move or delete them first."));
        _db.Categories.Remove(c);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<IActionResult?> ValidateAsync(CategoryUpsertRequest r, int? id)
    {
        if (r.ParentCategoryId is int parentId)
        {
            if (id == parentId) return BadRequest(ApiResponse.Fail("A category cannot be its own parent."));
            if (!await _db.Categories.AnyAsync(x => x.Id == parentId))
                return BadRequest(ApiResponse.Fail("Parent category does not exist."));

            // منع الدوائر: لو الأب الجديد هو واحد من أحفاد التصنيف ده.
            if (id is int selfId)
            {
                int? cursor = parentId;
                var guard = 0;
                while (cursor is int cur && guard++ < 100)
                {
                    if (cur == selfId)
                        return BadRequest(ApiResponse.Fail("Parent would create a cycle in the category tree."));
                    cursor = await _db.Categories.Where(x => x.Id == cur).Select(x => x.ParentCategoryId).FirstOrDefaultAsync();
                }
            }
        }
        return null;
    }

    private async Task<string?> ResolveSlugAsync(string? requested, string name, int? ignoreId)
    {
        var ignore = ignoreId ?? 0;
        var explicitSlug = !string.IsNullOrWhiteSpace(requested);
        var baseSlug = SlugHelper.Slugify(explicitSlug ? requested! : name, 170);
        if (baseSlug.Length == 0) baseSlug = "category";

        if (explicitSlug)
            return await _db.Categories.AnyAsync(c => c.Slug == baseSlug && c.Id != ignore) ? null : baseSlug;

        var slug = baseSlug;
        var n = 2;
        while (await _db.Categories.AnyAsync(c => c.Slug == slug && c.Id != ignore)) slug = $"{baseSlug}-{n++}";
        return slug;
    }
}
