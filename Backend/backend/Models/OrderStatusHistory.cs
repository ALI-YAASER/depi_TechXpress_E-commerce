using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class OrderStatusHistory
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string? OldStatus { get; set; }

    public string NewStatus { get; set; } = null!;

    public DateTime ChangedAt { get; set; }

    public string? ChangedByUserId { get; set; }

    public string? Note { get; set; }

    public virtual Order Order { get; set; } = null!;
}
