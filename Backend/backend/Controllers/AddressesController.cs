using System.Security.Claims;
using backend.Data;
using backend.DTOs.Orders;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/addresses")]
public class AddressesController : ControllerBase
{
    private readonly TechXpressDbContext _db;
    public AddressesController(TechXpressDbContext db) => _db = db;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<List<AddressDto>>> List() =>
        await _db.Addresses.AsNoTracking().Where(a => a.UserId == UserId)
            .OrderByDescending(a => a.IsDefault).ThenByDescending(a => a.Id)
            .Select(a => new AddressDto(a.Id, a.RecipientName, a.PhoneNumber, a.City, a.Street,
                a.BuildingNumber, a.AdditionalDetails, a.IsDefault, a.Orders.Any()))
            .ToListAsync();

    [HttpPost]
    public async Task<IActionResult> Create(AddressRequest req)
    {
        var uid = UserId;
        var hasAny = await _db.Addresses.AnyAsync(a => a.UserId == uid);
        var makeDefault = req.IsDefault || !hasAny; // أول عنوان بيبقى الافتراضي

        var a = new Address
        {
            UserId = uid, CreatedAt = DateTime.UtcNow, IsDefault = makeDefault
        };
        Apply(a, req);

        await using var tx = await _db.Database.BeginTransactionAsync();
        if (makeDefault)
            await _db.Addresses.Where(x => x.UserId == uid && x.IsDefault)
                .ExecuteUpdateAsync(s => s.SetProperty(x => x.IsDefault, false));
        _db.Addresses.Add(a);
        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        return StatusCode(StatusCodes.Status201Created, ToDto(a, false));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AddressRequest req)
    {
        var uid = UserId;
        var a = await _db.Addresses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == uid);
        if (a is null) return NotFound(ApiResponse.Fail("Address not found."));

        if (await _db.Orders.AnyAsync(o => o.AddressId == id))
            return Conflict(ApiResponse.Fail("This address is used by an existing order and can't be edited. Add a new address instead."));

        await using var tx = await _db.Database.BeginTransactionAsync();
        Apply(a, req);
        if (req.IsDefault && !a.IsDefault)
        {
            await _db.Addresses.Where(x => x.UserId == uid && x.IsDefault)
                .ExecuteUpdateAsync(s => s.SetProperty(x => x.IsDefault, false));
            a.IsDefault = true;
        }
        await _db.SaveChangesAsync();
        await tx.CommitAsync();
        return Ok(ToDto(a, false));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var uid = UserId;
        var a = await _db.Addresses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == uid);
        if (a is null) return NotFound(ApiResponse.Fail("Address not found."));

        if (await _db.Orders.AnyAsync(o => o.AddressId == id))
            return Conflict(ApiResponse.Fail("This address is used by an existing order and can't be deleted."));

        var wasDefault = a.IsDefault;
        _db.Addresses.Remove(a);
        await _db.SaveChangesAsync();

        if (wasDefault)
        {
            var next = await _db.Addresses.Where(x => x.UserId == uid).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
            if (next is not null) { next.IsDefault = true; await _db.SaveChangesAsync(); }
        }
        return NoContent();
    }

    private static void Apply(Address a, AddressRequest r)
    {
        a.RecipientName = r.RecipientName.Trim();
        a.PhoneNumber = r.PhoneNumber.Trim();
        a.City = r.City.Trim();
        a.Street = r.Street.Trim();
        a.BuildingNumber = r.BuildingNumber?.Trim();
        a.AdditionalDetails = r.AdditionalDetails?.Trim();
    }

    private static AddressDto ToDto(Address a, bool locked) =>
        new(a.Id, a.RecipientName, a.PhoneNumber, a.City, a.Street, a.BuildingNumber, a.AdditionalDetails, a.IsDefault, locked);
}
