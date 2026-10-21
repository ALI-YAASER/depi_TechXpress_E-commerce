using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int? ProductId { get; set; }

    public string ProductNameSnapshot { get; set; } = null!;

    public string? Skusnapshot { get; set; }

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal LineTotal { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product? Product { get; set; }
}
