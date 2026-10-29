using System.ComponentModel.DataAnnotations;
using backend.Helpers;

namespace backend.DTOs.Orders;

// ---------- Addresses ----------
public class AddressRequest
{
    [Required, MaxLength(200)] public string RecipientName { get; set; } = string.Empty;
    [Required, RegularExpression(@"^\+?[0-9\s\-]{7,20}$", ErrorMessage = "Invalid phone number.")]
    public string PhoneNumber { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string City { get; set; } = string.Empty;
    [Required, MaxLength(250)] public string Street { get; set; } = string.Empty;
    [MaxLength(50)] public string? BuildingNumber { get; set; }
    [MaxLength(500)] public string? AdditionalDetails { get; set; }
    public bool IsDefault { get; set; }
}

/// <summary>IsLocked = العنوان مستخدم في طلب، فمينفعش يتعدّل أو يتمسح (علشان سجل الطلبات يفضل ثابت).</summary>
public record AddressDto(int Id, string RecipientName, string PhoneNumber, string City, string Street,
    string? BuildingNumber, string? AdditionalDetails, bool IsDefault, bool IsLocked);

// ---------- Orders ----------
public class CreateOrderRequest
{
    [Range(1, int.MaxValue)] public int AddressId { get; set; }
    /// <summary>CashOnDelivery (Stripe في الخطوة 6).</summary>
    [Required] public string PaymentMethod { get; set; } = PaymentProviders.CashOnDelivery;
}

public class ChangeStatusRequest
{
    [Required] public string Status { get; set; } = string.Empty;
    [MaxLength(1000)] public string? Note { get; set; }
}

public class CancelOrderRequest
{
    [MaxLength(1000)] public string? Note { get; set; }
}

public class MyOrdersQuery : PaginationParams
{
    public string? Status { get; set; }
}

public class AdminOrderQuery : PaginationParams
{
    public string? Status { get; set; }
    public string? PaymentStatus { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    /// <summary>رقم الطلب أو اسم/إيميل العميل.</summary>
    public string? Search { get; set; }
}

public record OrderItemDto(int? ProductId, string Name, string? Sku, decimal UnitPrice, int Quantity, decimal LineTotal);
public record OrderAddressDto(string RecipientName, string PhoneNumber, string City, string Street,
    string? BuildingNumber, string? AdditionalDetails);
public record OrderStatusHistoryDto(string? OldStatus, string NewStatus, DateTime ChangedAt, string? Note);

public record OrderSummaryDto(
    int Id, string OrderNumber, string Status, string PaymentStatus, string? PaymentMethod,
    decimal TotalAmount, int ItemCount, DateTime CreatedAt,
    string? CustomerName = null, string? CustomerEmail = null);

public record OrderDetailDto(
    int Id, string OrderNumber, string Status, string PaymentStatus, string? PaymentMethod,
    decimal Subtotal, decimal ShippingCost, decimal DiscountAmount, decimal TotalAmount,
    DateTime CreatedAt, DateTime? UpdatedAt,
    OrderAddressDto? Address, List<OrderItemDto> Items, List<OrderStatusHistoryDto> History,
    string? CustomerName = null, string? CustomerEmail = null);
