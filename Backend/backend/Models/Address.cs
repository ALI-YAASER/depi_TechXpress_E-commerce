using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Address
{
    public int Id { get; set; }

    public string? UserId { get; set; }

    public string RecipientName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Street { get; set; } = null!;

    public string? BuildingNumber { get; set; }

    public string? AdditionalDetails { get; set; }

    public bool IsDefault { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
