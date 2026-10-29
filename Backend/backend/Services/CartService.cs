using backend.Data;
using backend.DTOs.Cart;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace backend.Services;

public record CartResult(CartDto? Cart, int StatusCode, string? Error)
{
    public static CartResult Ok(CartDto cart) => new(cart, StatusCodes.Status200OK, null);
    public static CartResult Fail(int status, string error) => new(null, status, error);
}

public class CartService
{
    /// <summary>أقصى كمية من نفس المنتج في السلة.</summary>
    public const int MaxQuantityPerItem = 10;

    private readonly TechXpressDbContext _db;
    public CartService(TechXpressDbContext db) => _db = db;

    public async Task<CartDto> GetCartAsync(string userId)
    {
        var rows = await _db.CartItems.AsNoTracking()
            .Where(ci => ci.Cart.UserId == userId)
            .OrderBy(ci => ci.Id)
            .Select(ci => new
            {
                ci.Id,
                ci.ProductId,
                ci.Quantity,
                ci.Product.Name,
                ci.Product.Slug,
                ci.Product.Sku,
                ci.Product.Price,
                ci.Product.DiscountPrice,
                ci.Product.StockQuantity,
                ci.Product.IsActive,
                Image = ci.Product.ProductImages
                    .OrderByDescending(i => i.IsPrimary).ThenBy(i => i.SortOrder)
                    .Select(i => i.ImageUrl).FirstOrDefault()
            })
            .ToListAsync();

        // الأسعار والمخزون كلها من قاعدة البيانات، مش من أي حاجة جاية من الفرونت.
        var items = rows.Select(r =>
        {
            var unit = r.DiscountPrice ?? r.Price;
            string? issue = null;
            if (!r.IsActive) issue = "This product is no longer available.";
            else if (r.StockQuantity <= 0) issue = "Out of stock.";
            else if (r.Quantity > r.StockQuantity) issue = $"Only {r.StockQuantity} left in stock.";

            return new CartItemDto(r.Id, r.ProductId, r.Name, r.Slug, r.Sku, r.Image,
                r.Price, unit, r.Quantity, unit * r.Quantity,
                r.StockQuantity, r.IsActive && r.StockQuantity > 0, issue);
        }).ToList();

        return new CartDto(
            items,
            items.Sum(i => i.Quantity),
            items.Where(i => i.IsAvailable).Sum(i => i.LineTotal),
            items.Any(i => i.Issue is not null));
    }

    public async Task<CartResult> AddItemAsync(string userId, int productId, int quantity)
    {
        var product = await _db.Products.AsNoTracking()
            .Where(p => p.Id == productId)
            .Select(p => new { p.IsActive, p.StockQuantity })
            .FirstOrDefaultAsync();
        if (product is null || !product.IsActive)
            return CartResult.Fail(StatusCodes.Status404NotFound, "Product not found.");
        if (product.StockQuantity <= 0)
            return CartResult.Fail(StatusCodes.Status409Conflict, "Product is out of stock.");

        var cart = await GetOrCreateCartAsync(userId);
        var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);

        // لو المنتج موجود في السلة بنزوّد الكمية (مفيش صفين لنفس المنتج).
        var newQuantity = (item?.Quantity ?? 0) + quantity;
        if (newQuantity > MaxQuantityPerItem)
            return CartResult.Fail(StatusCodes.Status409Conflict, $"You can order at most {MaxQuantityPerItem} of the same product.");
        if (newQuantity > product.StockQuantity)
            return CartResult.Fail(StatusCodes.Status409Conflict, $"Only {product.StockQuantity} left in stock.");

        if (item is null) cart.CartItems.Add(new CartItem { ProductId = productId, Quantity = newQuantity });
        else item.Quantity = newQuantity;
        cart.UpdatedAt = DateTime.UtcNow;

        try { await _db.SaveChangesAsync(); }
        catch (DbUpdateException)
        {
            // طلبين متزامنين على نفس المنتج اصطدموا في الـ unique index.
            return CartResult.Fail(StatusCodes.Status409Conflict, "The cart was changed at the same time. Please try again.");
        }
        return CartResult.Ok(await GetCartAsync(userId));
    }

    public async Task<CartResult> UpdateQuantityAsync(string userId, int itemId, int quantity)
    {
        // الشرط على userId بيمنع المستخدم من تعديل عناصر سلة غيره (IDOR).
        var item = await _db.CartItems.Include(ci => ci.Cart).Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.Cart.UserId == userId);
        if (item is null) return CartResult.Fail(StatusCodes.Status404NotFound, "Cart item not found.");

        if (!item.Product.IsActive || item.Product.StockQuantity <= 0)
            return CartResult.Fail(StatusCodes.Status409Conflict, "This product is not available.");
        if (quantity > MaxQuantityPerItem)
            return CartResult.Fail(StatusCodes.Status409Conflict, $"You can order at most {MaxQuantityPerItem} of the same product.");
        if (quantity > item.Product.StockQuantity)
            return CartResult.Fail(StatusCodes.Status409Conflict, $"Only {item.Product.StockQuantity} left in stock.");

        item.Quantity = quantity;
        item.Cart.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return CartResult.Ok(await GetCartAsync(userId));
    }

    public async Task<CartResult> RemoveItemAsync(string userId, int itemId)
    {
        var item = await _db.CartItems.Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.Cart.UserId == userId);
        if (item is null) return CartResult.Fail(StatusCodes.Status404NotFound, "Cart item not found.");

        item.Cart.UpdatedAt = DateTime.UtcNow;
        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return CartResult.Ok(await GetCartAsync(userId));
    }

    public async Task ClearAsync(string userId)
    {
        var items = await _db.CartItems.Where(ci => ci.Cart.UserId == userId).ToListAsync();
        if (items.Count == 0) return;
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
    }

    private async Task<Cart> GetOrCreateCartAsync(string userId)
    {
        var cart = await _db.Carts.Include(c => c.CartItems)
            .Where(c => c.UserId == userId).OrderBy(c => c.Id).FirstOrDefaultAsync();
        if (cart is not null) return cart;

        cart = new Cart { UserId = userId, CreatedAt = DateTime.UtcNow };
        _db.Carts.Add(cart);
        await _db.SaveChangesAsync();
        return cart;
    }
}
