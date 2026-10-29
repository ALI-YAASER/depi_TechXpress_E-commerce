using backend.DTOs.Cart;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly CartService _cart;
    public CartController(CartService cart) => _cart = cart;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<CartDto>> Get() => Ok(await _cart.GetCartAsync(UserId));

    [HttpPost("items")]
    public async Task<IActionResult> AddItem(AddCartItemRequest req) =>
        Map(await _cart.AddItemAsync(UserId, req.ProductId, req.Quantity));

    [HttpPut("items/{id:int}")]
    public async Task<IActionResult> UpdateItem(int id, UpdateCartItemRequest req) =>
        Map(await _cart.UpdateQuantityAsync(UserId, id, req.Quantity));

    [HttpDelete("items/{id:int}")]
    public async Task<IActionResult> RemoveItem(int id) =>
        Map(await _cart.RemoveItemAsync(UserId, id));

    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        await _cart.ClearAsync(UserId);
        return NoContent();
    }

    private IActionResult Map(CartResult r) =>
        r.Error is not null ? StatusCode(r.StatusCode, ApiResponse.Fail(r.Error)) : Ok(r.Cart);
}
