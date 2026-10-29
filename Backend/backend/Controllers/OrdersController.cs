using System.Security.Claims;
using backend.DTOs.Orders;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orders;
    public OrdersController(OrderService orders) => _orders = orders;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderRequest req)
    {
        var r = await _orders.CreateAsync(UserId, req);
        if (r.Error is not null) return StatusCode(r.StatusCode, ApiResponse.Fail(r.Error));
        return CreatedAtAction(nameof(GetById), new { id = r.Order!.Id }, r.Order);
    }

    [HttpGet("my")]
    public async Task<IActionResult> My([FromQuery] MyOrdersQuery query)
    {
        var result = await _orders.ListMineAsync(UserId, query);
        return result is null ? BadRequest(ApiResponse.Fail("Unknown order status.")) : Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _orders.GetForUserAsync(UserId, id);
        return dto is null ? NotFound(ApiResponse.Fail("Order not found.")) : Ok(dto);
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id, CancelOrderRequest? req)
    {
        var r = await _orders.CancelAsync(UserId, id, req?.Note);
        return r.Error is not null ? StatusCode(r.StatusCode, ApiResponse.Fail(r.Error)) : Ok(r.Order);
    }
}
