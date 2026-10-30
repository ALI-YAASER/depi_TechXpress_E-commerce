using System.Security.Cryptography;
using backend.Data;
using backend.DTOs.Orders;
using backend.Helpers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public record OrderResult(OrderDetailDto? Order, int StatusCode, string? Error)
{
    public static OrderResult Ok(OrderDetailDto o, int status = StatusCodes.Status200OK) => new(o, status, null);
    public static OrderResult Fail(int status, string error) => new(null, status, error);
}

public class OrderService
{
    private readonly TechXpressDbContext _db;
    private readonly IConfiguration _config;

    public OrderService(TechXpressDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    // ------------------------------------------------------------------ create

    public async Task<OrderResult> CreateAsync(string userId, CreateOrderRequest req)
    {
        if (!string.Equals(req.PaymentMethod?.Trim(), PaymentProviders.CashOnDelivery, StringComparison.OrdinalIgnoreCase))
            return OrderResult.Fail(StatusCodes.Status400BadRequest, "Only Cash on Delivery is available right now.");

        // العنوان لازم يخص المستخدم نفسه.
        if (!await _db.Addresses.AsNoTracking().AnyAsync(a => a.Id == req.AddressId && a.UserId == userId))
            return OrderResult.Fail(StatusCodes.Status400BadRequest, "Shipping address not found.");

        // كل حاجة (خصم المخزون + الطلب + تفريغ السلة) إما تنجح مع بعض أو تفشل مع بعض.
        await using var tx = await _db.Database.BeginTransactionAsync();

        var lines = await _db.CartItems.AsNoTracking()
            .Where(ci => ci.Cart.UserId == userId)
            .Select(ci => new
            {
                ci.Id, ci.ProductId, ci.Quantity,
                ci.Product.Name, ci.Product.Sku, ci.Product.Price, ci.Product.DiscountPrice, ci.Product.IsActive
            })
            .ToListAsync();

        if (lines.Count == 0)
            return OrderResult.Fail(StatusCodes.Status400BadRequest, "Your cart is empty.");
        var inactive = lines.FirstOrDefault(l => !l.IsActive);
        if (inactive is not null)
            return OrderResult.Fail(StatusCodes.Status409Conflict, $"'{inactive.Name}' is no longer available. Remove it from your cart.");

        // خصم المخزون بأمر واحد مشروط (StockQuantity >= الكمية): لو اتنين اشتروا آخر قطعة، واحد بس بينجح.
        DateTime? now = DateTime.UtcNow;
        foreach (var l in lines)
        {
            var pid = l.ProductId;
            var qty = l.Quantity;
            var affected = await _db.Products
                .Where(p => p.Id == pid && p.IsActive && p.StockQuantity >= qty)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(p => p.StockQuantity, p => p.StockQuantity - qty)
                    .SetProperty(p => p.UpdatedAt, now));
            if (affected == 0)
            {
                await tx.RollbackAsync();
                return OrderResult.Fail(StatusCodes.Status409Conflict,
                    $"'{l.Name}' doesn't have enough stock for the quantity in your cart.");
            }
        }

        // الأسعار بتتحسب هنا من قاعدة البيانات، مش من الفرونت.
        var subtotal = lines.Sum(l => (l.DiscountPrice ?? l.Price) * l.Quantity);
        var shipping = _config.GetValue("Shop:ShippingCost", 0m);
        var total = subtotal + shipping;
        var created = now!.Value;

        var order = new Order
        {
            OrderNumber = await NewOrderNumberAsync(),
            UserId = userId,
            AddressId = req.AddressId,
            Status = OrderStatuses.Processing,   // COD: الطلب بيتأكد على طول
            PaymentStatus = PaymentStatuses.Pending,
            Subtotal = subtotal,
            ShippingCost = shipping,
            DiscountAmount = 0,
            TotalAmount = total,
            CreatedAt = created
        };
        foreach (var l in lines)
        {
            var unit = l.DiscountPrice ?? l.Price;
            order.OrderItems.Add(new OrderItem
            {
                ProductId = l.ProductId,
                ProductNameSnapshot = l.Name,
                Skusnapshot = l.Sku,
                UnitPrice = unit,                 // السعر وقت الشراء
                Quantity = l.Quantity,
                LineTotal = unit * l.Quantity
            });
        }
        order.Payments.Add(new Payment
        {
            Provider = PaymentProviders.CashOnDelivery,
            Amount = total,
            Currency = "EGP",
            Status = PaymentStatuses.Pending,
            CreatedAt = created
        });
        order.OrderStatusHistories.Add(new OrderStatusHistory
        {
            OldStatus = null,
            NewStatus = OrderStatuses.Processing,
            ChangedAt = created,
            ChangedByUserId = userId,
            Note = "Order placed (Cash on Delivery)"
        });

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var cartItemIds = lines.Select(l => l.Id).ToList();
        await _db.CartItems.Where(ci => cartItemIds.Contains(ci.Id)).ExecuteDeleteAsync();

        await tx.CommitAsync();

        var dto = await ProjectDetail(_db.Orders.AsNoTracking().Where(o => o.Id == order.Id)).FirstAsync();
        return OrderResult.Ok(dto, StatusCodes.Status201Created);
    }

    // ------------------------------------------------------------------ read

    public async Task<PagedResult<OrderSummaryDto>?> ListMineAsync(string userId, MyOrdersQuery query)
    {
        var q = _db.Orders.AsNoTracking().Where(o => o.UserId == userId);
        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            var status = OrderStatuses.Normalize(query.Status);
            if (status is null) return null; // الكنترولر يرجّع 400
            q = q.Where(o => o.Status == status);
        }
        return await PageSummariesAsync(q, query, includeCustomer: false);
    }

    public Task<OrderDetailDto?> GetForUserAsync(string userId, int id) =>
        // الشرط على UserId بيمنع أي عميل يشوف طلب غيره.
        ProjectDetail(_db.Orders.AsNoTracking().Where(o => o.Id == id && o.UserId == userId)).FirstOrDefaultAsync();

    public async Task<OrderDetailDto?> GetForAdminAsync(int id)
    {
        var dto = await ProjectDetail(_db.Orders.AsNoTracking().Where(o => o.Id == id)).FirstOrDefaultAsync();
        if (dto is null) return null;

        var uid = await _db.Orders.AsNoTracking().Where(o => o.Id == id).Select(o => o.UserId).FirstAsync();
        var user = await _db.Users.AsNoTracking().Where(u => u.Id == uid)
            .Select(u => new { u.FullName, u.Email }).FirstOrDefaultAsync();
        return user is null ? dto : dto with { CustomerName = user.FullName, CustomerEmail = user.Email };
    }

    public async Task<PagedResult<OrderSummaryDto>?> ListAdminAsync(AdminOrderQuery query)
    {
        var q = _db.Orders.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            var status = OrderStatuses.Normalize(query.Status);
            if (status is null) return null;
            q = q.Where(o => o.Status == status);
        }
        if (!string.IsNullOrWhiteSpace(query.PaymentStatus))
        {
            var ps = query.PaymentStatus.Trim();
            q = q.Where(o => o.PaymentStatus == ps);
        }
        if (query.From is DateTime from) q = q.Where(o => o.CreatedAt >= from);
        if (query.To is DateTime to) q = q.Where(o => o.CreatedAt < to.Date.AddDays(1));

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            var userIds = await _db.Users.AsNoTracking()
                .Where(u => u.Email!.Contains(s) || u.FullName.Contains(s))
                .Select(u => u.Id).Take(200).ToListAsync();
            q = q.Where(o => o.OrderNumber.Contains(s) || userIds.Contains(o.UserId));
        }
        return await PageSummariesAsync(q, query, includeCustomer: true);
    }

    // ------------------------------------------------------------------ status changes

    public Task<OrderResult> CancelAsync(string userId, int orderId, string? note) =>
        ChangeStatusAsync(orderId, OrderStatuses.Cancelled, userId, isAdmin: false, note);

    public async Task<OrderResult> ChangeStatusAsync(int orderId, string requestedStatus, string actorId, bool isAdmin, string? note)
    {
        var newStatus = OrderStatuses.Normalize(requestedStatus);
        if (newStatus is null)
            return OrderResult.Fail(StatusCodes.Status400BadRequest,
                $"Unknown status. Allowed: {string.Join(", ", OrderStatuses.All)}.");

        var order = await _db.Orders.AsNoTracking()
            .Where(o => o.Id == orderId && (isAdmin || o.UserId == actorId))
            .Select(o => new
            {
                o.Status, o.PaymentStatus,
                Provider = o.Payments.OrderBy(p => p.Id).Select(p => p.Provider).FirstOrDefault(),
                Items = o.OrderItems.Select(i => new { i.ProductId, i.Quantity }).ToList()
            })
            .FirstOrDefaultAsync();
        if (order is null) return OrderResult.Fail(StatusCodes.Status404NotFound, "Order not found.");

        // العميل مسموحله بالإلغاء بس.
        if (!isAdmin && newStatus != OrderStatuses.Cancelled)
            return OrderResult.Fail(StatusCodes.Status403Forbidden, "Customers can only cancel orders.");

        if (!OrderStatuses.CanTransition(order.Status, newStatus))
            return OrderResult.Fail(StatusCodes.Status409Conflict, $"Cannot change an order from {order.Status} to {newStatus}.");

        if (newStatus == OrderStatuses.Cancelled && order.PaymentStatus == PaymentStatuses.Paid)
            return OrderResult.Fail(StatusCodes.Status409Conflict,
                "This order is already paid. It must be refunded before it can be cancelled.");

        var oldStatus = order.Status;
        var isCod = order.Provider == PaymentProviders.CashOnDelivery;
        var newPaymentStatus = order.PaymentStatus;
        if (newStatus == OrderStatuses.Cancelled && order.PaymentStatus == PaymentStatuses.Pending)
            newPaymentStatus = PaymentStatuses.Cancelled;
        if (newStatus == OrderStatuses.Delivered && isCod)
            newPaymentStatus = PaymentStatuses.Paid; // الفلوس اتحصّلت عند التسليم

        await using var tx = await _db.Database.BeginTransactionAsync();
        DateTime? now = DateTime.UtcNow;

        // "نحجز" الانتقال بأمر مشروط بالحالة القديمة: لو اتنين ضغطوا في نفس اللحظة، واحد بس ينجح
        // (وبكده المخزون مايتردش مرتين).
        var claimed = await _db.Orders.Where(o => o.Id == orderId && o.Status == oldStatus)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.Status, newStatus)
                .SetProperty(o => o.PaymentStatus, newPaymentStatus)
                .SetProperty(o => o.UpdatedAt, now));
        if (claimed == 0)
        {
            await tx.RollbackAsync();
            return OrderResult.Fail(StatusCodes.Status409Conflict, "The order was changed by someone else. Reload and try again.");
        }

        if (newStatus == OrderStatuses.Cancelled)
        {
            // رجّع المخزون.
            foreach (var item in order.Items.Where(i => i.ProductId != null))
            {
                var pid = item.ProductId!.Value;
                var qty = item.Quantity;
                await _db.Products.Where(p => p.Id == pid)
                    .ExecuteUpdateAsync(s => s.SetProperty(p => p.StockQuantity, p => p.StockQuantity + qty));
            }
            await _db.Payments.Where(p => p.OrderId == orderId && p.Status == PaymentStatuses.Pending)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.Status, PaymentStatuses.Cancelled));
        }
        else if (newStatus == OrderStatuses.Delivered && isCod)
        {
            await _db.Payments.Where(p => p.OrderId == orderId && p.Provider == PaymentProviders.CashOnDelivery
                                          && p.Status == PaymentStatuses.Pending)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(p => p.Status, PaymentStatuses.Paid)
                    .SetProperty(p => p.PaidAt, now));
        }

        _db.OrderStatusHistories.Add(new OrderStatusHistory
        {
            OrderId = orderId,
            OldStatus = oldStatus,
            NewStatus = newStatus,
            ChangedAt = now!.Value,
            ChangedByUserId = actorId,
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim()
        });
        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        var dto = isAdmin ? await GetForAdminAsync(orderId) : await GetForUserAsync(actorId, orderId);
        return OrderResult.Ok(dto!);
    }

    // ------------------------------------------------------------------ helpers

    private async Task<PagedResult<OrderSummaryDto>> PageSummariesAsync(
        IQueryable<Order> q, PaginationParams page, bool includeCustomer)
    {
        var total = await q.CountAsync();
        var rows = await q.OrderByDescending(o => o.CreatedAt).ThenByDescending(o => o.Id)
            .Skip((page.Page - 1) * page.PageSize).Take(page.PageSize)
            .Select(o => new
            {
                o.Id, o.OrderNumber, o.Status, o.PaymentStatus,
                Method = o.Payments.OrderBy(p => p.Id).Select(p => p.Provider).FirstOrDefault(),
                o.TotalAmount, Count = o.OrderItems.Sum(i => i.Quantity), o.CreatedAt, o.UserId
            })
            .ToListAsync();

        var users = new Dictionary<string, (string Name, string? Email)>();
        if (includeCustomer && rows.Count > 0)
        {
            var ids = rows.Select(r => r.UserId).Distinct().ToList();
            users = await _db.Users.AsNoTracking().Where(u => ids.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => (u.FullName, u.Email));
        }

        var items = rows.Select(r => new OrderSummaryDto(
            r.Id, r.OrderNumber, r.Status, r.PaymentStatus, r.Method, r.TotalAmount, r.Count, r.CreatedAt,
            users.TryGetValue(r.UserId, out var u) ? u.Name : null,
            users.TryGetValue(r.UserId, out var u2) ? u2.Email : null)).ToList();

        return new PagedResult<OrderSummaryDto> { Items = items, Page = page.Page, PageSize = page.PageSize, TotalCount = total };
    }

    private static IQueryable<OrderDetailDto> ProjectDetail(IQueryable<Order> q) =>
        q.Select(o => new OrderDetailDto(
            o.Id, o.OrderNumber, o.Status, o.PaymentStatus,
            o.Payments.OrderBy(p => p.Id).Select(p => p.Provider).FirstOrDefault(),
            o.Subtotal, o.ShippingCost, o.DiscountAmount, o.TotalAmount, o.CreatedAt, o.UpdatedAt,
            o.Address == null ? null : new OrderAddressDto(
                o.Address.RecipientName, o.Address.PhoneNumber, o.Address.City, o.Address.Street,
                o.Address.BuildingNumber, o.Address.AdditionalDetails),
            o.OrderItems.OrderBy(i => i.Id)
                .Select(i => new OrderItemDto(i.ProductId, i.ProductNameSnapshot, i.Skusnapshot, i.UnitPrice, i.Quantity, i.LineTotal))
                .ToList(),
            o.OrderStatusHistories.OrderBy(h => h.ChangedAt).ThenBy(h => h.Id)
                .Select(h => new OrderStatusHistoryDto(h.OldStatus, h.NewStatus, h.ChangedAt, h.Note))
                .ToList(),
            null, null));

    private async Task<string> NewOrderNumberAsync()
    {
        for (var i = 0; i < 5; i++)
        {
            var number = $"TX-{DateTime.UtcNow:yyyyMMdd}-{RandomNumberGenerator.GetInt32(100000, 1000000)}";
            if (!await _db.Orders.AnyAsync(o => o.OrderNumber == number)) return number;
        }
        throw new InvalidOperationException("Could not generate a unique order number.");
    }
}
