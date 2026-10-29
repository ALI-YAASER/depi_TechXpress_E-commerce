using System.ComponentModel.DataAnnotations;
using backend.Helpers;

namespace backend.DTOs.Admin;

public record OrderStatusCountDto(string Status, int Count);

public record DashboardStatsDto(
    decimal TotalRevenue, int PaidOrders, decimal AverageOrderValue,
    int TotalOrders, int CancelledOrders,
    int TotalCustomers, int TotalProducts, int LowStockCount, int OutOfStockCount,
    List<OrderStatusCountDto> OrdersByStatus);

public record SalesPointDto(string Period, decimal Revenue, int Orders);

public record BestSellerDto(int ProductId, string Name, int UnitsSold, decimal Revenue);

public record LowStockProductDto(int ProductId, string Name, string Sku, int StockQuantity);

public class InventoryQuery : PaginationParams
{
    public string? Search { get; set; }
    public bool? LowStockOnly { get; set; }
    public bool IncludeInactive { get; set; }
}

public record InventoryItemDto(
    int ProductId, string Name, string Sku, int StockQuantity, bool IsActive,
    string CategoryName, string BrandName, bool IsLowStock);

/// <summary>ابعت واحد بس: StockQuantity (تحديد الكمية) أو Delta (زيادة/نقص).</summary>
public class InventoryUpdateRequest
{
    [Range(0, 1_000_000)] public int? StockQuantity { get; set; }
    [Range(-100_000, 100_000)] public int? Delta { get; set; }
}
