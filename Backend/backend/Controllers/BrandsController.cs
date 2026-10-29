using backend.Data;
using backend.DTOs.Products;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/brands")]
public class BrandsController : ControllerBase
{
    private readonly TechXpressDbContext _db;
    public BrandsController(TechXpressDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<BrandDto>>> List([FromQuery] bool includeInactive = false)
    {
        var q = _db.Brands.AsNoTracking().AsQueryable();
        if (!(includeInactive && User.IsInRole(Roles.Admin))) q = q.Where(b => b.IsActive);
        return await q.OrderBy(b => b.Name)
            .Select(b => new BrandDto(b.Id, b.Name, b.LogoUrl, b.IsActive, b.Products.Count(p => p.IsActive)))
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var dto = await _db.Brands.AsNoTracking().Where(b => b.Id == id)
            .Select(b => new BrandDto(b.Id, b.Name, b.LogoUrl, b.IsActive, b.Products.Count(p => p.IsActive)))
            .FirstOrDefaultAsync();
        if (dto is null || (!dto.IsActive && !User.IsInRole(Roles.Admin)))
            return NotFound(ApiResponse.Fail("Brand not found."));
        return Ok(dto);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create(BrandUpsertRequest req)
    {
        var name = req.Name.Trim();
        if (await _db.Brands.AnyAsync(b => b.Name == name))
            return Conflict(ApiResponse.Fail("A brand with this name already exists."));

        var b = new Brand { Name = name, LogoUrl = req.LogoUrl?.Trim(), IsActive = req.IsActive, CreatedAt = DateTime.UtcNow };
        _db.Brands.Add(b);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = b.Id }, new BrandDto(b.Id, b.Name, b.LogoUrl, b.IsActive, 0));
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BrandUpsertRequest req)
    {
        var b = await _db.Brands.FindAsync(id);
        if (b is null) return NotFound(ApiResponse.Fail("Brand not found."));
        var name = req.Name.Trim();
        if (await _db.Brands.AnyAsync(x => x.Name == name && x.Id != id))
            return Conflict(ApiResponse.Fail("A brand with this name already exists."));

        b.Name = name;
        b.LogoUrl = req.LogoUrl?.Trim();
        b.IsActive = req.IsActive;
        await _db.SaveChangesAsync();
        return Ok(new BrandDto(b.Id, b.Name, b.LogoUrl, b.IsActive,
            await _db.Products.CountAsync(p => p.BrandId == id && p.IsActive)));
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var b = await _db.Brands.FindAsync(id);
        if (b is null) return NotFound(ApiResponse.Fail("Brand not found."));
        if (await _db.Products.AnyAsync(p => p.BrandId == id))
            return Conflict(ApiResponse.Fail("Brand still has products. Move or delete them first."));
        _db.Brands.Remove(b);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
