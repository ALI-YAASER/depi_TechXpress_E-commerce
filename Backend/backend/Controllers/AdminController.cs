//using System.Security.Claims;
//using backend.DTOs.Orders;
//using backend.Helpers;
//using backend.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace backend.Controllers;

//[ApiController]
//[Authorize(Roles = Roles.Admin)]
//[Route("api/admin")]
//public class AdminController : ControllerBase
//{
//    private readonly OrderService _orders;
//    public AdminController(OrderService orders) => _orders = orders;

//    // GET /api/admin/orders?status=Processing&from=2026-10-01&to=2026-10-31&search=TX-2026&page=1
//    [HttpGet("orders")]
//    public async Task<IActionResult> ListOrders([FromQuery] AdminOrderQuery query)
//    {
//        var result = await _orders.ListAdminAsync(query);
//        return result is null ? BadRequest(ApiResponse.Fail("Unknown order status.")) : Ok(result);
//    }

//    [HttpGet("orders/{id:int}")]
//    public async Task<IActionResult> GetOrder(int id)
//    {
//        var dto = await _orders.GetForAdminAsync(id);
//        return dto is null ? NotFound(ApiResponse.Fail("Order not found.")) : Ok(dto);
//    }

//    [HttpPatch("orders/{id:int}/status")]
//    public async Task<IActionResult> ChangeStatus(int id, ChangeStatusRequest req)
//    {
//        var actor = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
//        var r = await _orders.ChangeStatusAsync(id, req.Status, actor, isAdmin: true, req.Note);
//        return r.Error is not null ? StatusCode(r.StatusCode, ApiResponse.Fail(r.Error)) : Ok(r.Order);
//    }
//}
using System.Security.Claims;
using backend.Data;
using backend.DTOs.Admin;
using backend.DTOs.Orders;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Authorize(Roles = Roles.Admin)]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly OrderService _orders;
    private readonly DashboardService _dashboard;
    private readonly TechXpressDbContext _db;

    public AdminController(OrderService orders, DashboardService dashboard, TechXpressDbContext db)
    {
        _orders = orders;
        _dashboard = dashboard;
        _db = db;
    }

    // ------------------------------------------------------------ dashboard

    // GET /api/admin/dashboard/stats?from=2026-10-01&to=2026-10-31  (من غير تواريخ = كل الفترة)
    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> Stats([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        if (from > to) return BadRequest(ApiResponse.Fail("'from' must not be after 'to'."));
        return Ok(await _dashboard.GetStatsAsync(from, to));
    }

    // GET /api/admin/dashboard/sales?from=...&to=...&groupBy=day|month  (الافتراضي: آخر 30 يوم بالأيام)
    [HttpGet("dashboard/sales")]
    public async Task<IActionResult> Sales(
        [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string groupBy = "day")
    {
        var byMonth = string.Equals(groupBy, "month", StringComparison.OrdinalIgnoreCase);
        if (!byMonth && !string.Equals(groupBy, "day", StringComparison.OrdinalIgnoreCase))
            return BadRequest(ApiResponse.Fail("groupBy must be 'day' or 'month'."));

        var end = (to ?? DateTime.UtcNow).Date;
        var start = (from ?? end.AddDays(byMonth ? -364 : -29)).Date;
        if (start > end) return BadRequest(ApiResponse.Fail("'from' must not be after 'to'."));
        if (!byMonth && (end - start).TotalDays > 366)
            return BadRequest(ApiResponse.Fail("Daily range cannot exceed 366 days. Use groupBy=month."));
        if (byMonth && (end.Year - start.Year) * 12 + end.Month - start.Month > 60)
            return BadRequest(ApiResponse.Fail("Monthly range cannot exceed 60 months."));

        return Ok(await _dashboard.GetSalesAsync(start, end, byMonth));
    }

    [HttpGet("dashboard/best-sellers")]
    public async Task<IActionResult> BestSellers(
        [FromQuery] int take = 5, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
    {
        if (take is < 1 or > 50) return BadRequest(ApiResponse.Fail("take must be between 1 and 50."));
        return Ok(await _dashboard.GetBestSellersAsync(take, from, to));
    }

    [HttpGet("dashboard/low-stock")]
    public async Task<IActionResult> LowStock([FromQuery] int take = 10)
    {
        if (take is < 1 or > 100) return BadRequest(ApiResponse.Fail("take must be between 1 and 100."));
        return Ok(await _dashboard.GetLowStockAsync(take));
    }

    // ------------------------------------------------------------ inventory

    [HttpGet("inventory")]
    public async Task<ActionResult<PagedResult<InventoryItemDto>>> Inventory([FromQuery] InventoryQuery query)
    {
        var threshold = _dashboard.LowStockThreshold;
        var q = _db.Products.AsNoTracking().AsQueryable();
        if (!query.IncludeInactive) q = q.Where(p => p.IsActive);
        if (query.LowStockOnly == true) q = q.Where(p => p.StockQuantity <= threshold);
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(p => p.Name.Contains(s) || p.Sku.Contains(s));
        }

        var total = await q.CountAsync();
        var items = await q.OrderBy(p => p.StockQuantity).ThenBy(p => p.Name)
            .Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(p => new InventoryItemDto(p.Id, p.Name, p.Sku, p.StockQuantity, p.IsActive,
                p.Category.Name, p.Brand.Name, p.StockQuantity <= threshold))
            .ToListAsync();

        return Ok(new PagedResult<InventoryItemDto>
        { Items = items, Page = query.Page, PageSize = query.PageSize, TotalCount = total });
    }

    // PATCH /api/admin/inventory/5   { "stockQuantity": 40 }   أو   { "delta": -3 }
    [HttpPatch("inventory/{productId:int}")]
    public async Task<IActionResult> UpdateStock(int productId, InventoryUpdateRequest req)
    {
        if ((req.StockQuantity is null) == (req.Delta is null))
            return BadRequest(ApiResponse.Fail("Send exactly one of 'stockQuantity' or 'delta'."));

        DateTime? now = DateTime.UtcNow;
        int affected;
        if (req.StockQuantity is int value)
        {
            affected = await _db.Products.Where(p => p.Id == productId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(p => p.StockQuantity, value)
                    .SetProperty(p => p.UpdatedAt, now));
        }
        else
        {
            var delta = req.Delta!.Value;
            // أمر واحد مشروط: المخزون مايقدرش ينزل تحت الصفر حتى لو فيه عمليات متزامنة.
            affected = await _db.Products.Where(p => p.Id == productId && p.StockQuantity + delta >= 0)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(p => p.StockQuantity, p => p.StockQuantity + delta)
                    .SetProperty(p => p.UpdatedAt, now));
        }

        if (affected == 0)
        {
            return await _db.Products.AnyAsync(p => p.Id == productId)
                ? Conflict(ApiResponse.Fail("Stock cannot go below zero."))
                : NotFound(ApiResponse.Fail("Product not found."));
        }

        var threshold = _dashboard.LowStockThreshold;
        var dto = await _db.Products.AsNoTracking().Where(p => p.Id == productId)
            .Select(p => new InventoryItemDto(p.Id, p.Name, p.Sku, p.StockQuantity, p.IsActive,
                p.Category.Name, p.Brand.Name, p.StockQuantity <= threshold))
            .FirstAsync();
        return Ok(dto);
    }

    // ------------------------------------------------------------ orders

    // GET /api/admin/orders?status=Processing&from=2026-10-01&to=2026-10-31&search=TX-2026&page=1
    [HttpGet("orders")]
    public async Task<IActionResult> ListOrders([FromQuery] AdminOrderQuery query)
    {
        var result = await _orders.ListAdminAsync(query);
        return result is null ? BadRequest(ApiResponse.Fail("Unknown order status.")) : Ok(result);
    }

    [HttpGet("orders/{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var dto = await _orders.GetForAdminAsync(id);
        return dto is null ? NotFound(ApiResponse.Fail("Order not found.")) : Ok(dto);
    }

    [HttpPatch("orders/{id:int}/status")]
    public async Task<IActionResult> ChangeStatus(int id, ChangeStatusRequest req)
    {
        var actor = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var r = await _orders.ChangeStatusAsync(id, req.Status, actor, isAdmin: true, req.Note);
        return r.Error is not null ? StatusCode(r.StatusCode, ApiResponse.Fail(r.Error)) : Ok(r.Order);
    }
}
