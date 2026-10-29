using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Cart;

public class AddCartItemRequest
{
    [Range(1, int.MaxValue)] public int ProductId { get; set; }
    [Range(1, 100)] public int Quantity { get; set; } = 1;
}

public class UpdateCartItemRequest
{
    [Range(1, 100)] public int Quantity { get; set; }
}

public record CartItemDto(
    int Id, int ProductId, string Name, string Slug, string Sku, string? ImageUrl,
    decimal OriginalPrice, decimal UnitPrice, int Quantity, decimal LineTotal,
    int StockQuantity, bool IsAvailable, string? Issue);

public record CartDto(
    List<CartItemDto> Items, int ItemCount, decimal Subtotal, bool HasIssues);
