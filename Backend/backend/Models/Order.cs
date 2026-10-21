using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Order
{
    public int Id { get; set; }

    public string OrderNumber { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public int? AddressId { get; set; }

    public string Status { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public decimal Subtotal { get; set; }

    public decimal ShippingCost { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
