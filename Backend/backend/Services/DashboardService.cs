using backend.Data;
using backend.DTOs.Admin;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DashboardService
{
    private readonly TechXpressDbContext _db;
    private readonly IConfiguration _config;

    public DashboardService(TechXpressDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public int LowStockThreshold => _config.GetValue("Shop:LowStockThreshold", 5);

    /// <summary>الطلبات اللي تاريخ إنشائها داخل المدى (من/إلى شاملين).</summary>
    private IQueryable<Models.Order> InRange(DateTime? from, DateTime? to)
    {
        var q = _db.Orders.AsNoTracking().AsQueryable();
        if (from is DateTime f) q = q.Where(o => o.CreatedAt >= f.Date);
        if (to is DateTime t) q = q.Where(o => o.CreatedAt < t.Date.AddDays(1));
        return q;
    }

    /// <summary>
    /// تعريف الإيراد: طلبات PaymentStatus = Paid وحالتها مش Cancelled.
    /// (COD بيتحسب بعد التسليم، Stripe بعد تأكيد الـ webhook. الملغي والمسترد مش داخلين.)
    /// </summary>
    private static IQueryable<Models.Order> Revenue(IQueryable<Models.Order> q) =>
        q.Where(o => o.PaymentStatus == PaymentStatuses.Paid && o.Status != OrderStatuses.Cancelled);

    public async Task<DashboardStatsDto> GetStatsAsync(DateTime? from, DateTime? to)
    {
        var orders = InRange(from, to);

        var totalOrders = await orders.CountAsync();
        var statusCounts = await orders.GroupBy(o => o.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() }).ToListAsync();

        var revenueOrders = Revenue(orders);
        var revenue = await revenueOrders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;
        var paidOrders = await revenueOrders.CountAsync();

        var threshold = LowStockThreshold;
        var activeProducts = _db.Products.AsNoTracking().Where(p => p.IsActive);
        var totalProducts = await activeProducts.CountAsync();
        var lowStock = await activeProducts.CountAsync(p => p.StockQuantity <= threshold);
        var outOfStock = await activeProducts.CountAsync(p => p.StockQuantity == 0);

        var customerRoleId = await _db.Roles.AsNoTracking()
            .Where(r => r.Name == Roles.Customer).Select(r => r.Id).FirstOrDefaultAsync();
        var customers = customerRoleId is null
            ? 0
            : await _db.UserRoles.AsNoTracking().CountAsync(ur => ur.RoleId == customerRoleId);

        // كل الحالات تظهر حتى لو عددها صفر (علشان الرسم البياني).
        var byStatus = OrderStatuses.All
            .Select(s => new OrderStatusCountDto(s, statusCounts.FirstOrDefault(c => c.Status == s)?.Count ?? 0))
            .ToList();

        return new DashboardStatsDto(
            revenue, paidOrders, paidOrders == 0 ? 0m : Math.Round(revenue / paidOrders, 2),
            totalOrders, byStatus.First(s => s.Status == OrderStatuses.Cancelled).Count,
            customers, totalProducts, lowStock, outOfStock, byStatus);
    }

    /// <summary>المبيعات عبر الزمن (بتاريخ إنشاء الطلب)، والأيام/الشهور الفاضية بتتملي بصفر.</summary>
    public async Task<List<SalesPointDto>> GetSalesAsync(DateTime start, DateTime end, bool byMonth)
    {
        var q = Revenue(InRange(start, end));

        if (!byMonth)
        {
            var rows = await q.GroupBy(o => o.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Revenue = g.Sum(o => o.TotalAmount), Orders = g.Count() })
                .ToListAsync();
            var map = rows.ToDictionary(r => r.Date.Date);

            var list = new List<SalesPointDto>();
            for (var d = start.Date; d <= end.Date; d = d.AddDays(1))
                list.Add(map.TryGetValue(d, out var r)
                    ? new SalesPointDto(d.ToString("yyyy-MM-dd"), r.Revenue, r.Orders)
                    : new SalesPointDto(d.ToString("yyyy-MM-dd"), 0m, 0));
            return list;
        }

        var monthRows = await q.GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Revenue = g.Sum(o => o.TotalAmount), Orders = g.Count() })
            .ToListAsync();
        var monthMap = monthRows.ToDictionary(r => (r.Year, r.Month));

        var months = new List<SalesPointDto>();
        for (var m = new DateTime(start.Year, start.Month, 1); m <= new DateTime(end.Year, end.Month, 1); m = m.AddMonths(1))
            months.Add(monthMap.TryGetValue((m.Year, m.Month), out var r)
                ? new SalesPointDto(m.ToString("yyyy-MM"), r.Revenue, r.Orders)
                : new SalesPointDto(m.ToString("yyyy-MM"), 0m, 0));
        return months;
    }

    /// <summary>الأكثر مبيعًا = إجمالي الكمية في الطلبات غير الملغاة.</summary>
    public async Task<List<BestSellerDto>> GetBestSellersAsync(int take, DateTime? from, DateTime? to)
    {
        var q = _db.OrderItems.AsNoTracking()
            .Where(i => i.ProductId != null && i.Order.Status != OrderStatuses.Cancelled);
        if (from is DateTime f) q = q.Where(i => i.Order.CreatedAt >= f.Date);
        if (to is DateTime t) q = q.Where(i => i.Order.CreatedAt < t.Date.AddDays(1));

        var rows = await q.GroupBy(i => i.ProductId)
            .Select(g => new
            {
                ProductId = g.Key,
                Name = g.Max(i => i.ProductNameSnapshot),
                Units = g.Sum(i => i.Quantity),
                Revenue = g.Sum(i => i.LineTotal)
            })
            .OrderByDescending(x => x.Units).ThenByDescending(x => x.Revenue)
            .Take(take)
            .ToListAsync();

        return rows.Select(r => new BestSellerDto(r.ProductId!.Value, r.Name ?? string.Empty, r.Units, r.Revenue)).ToList();
    }

    public async Task<List<LowStockProductDto>> GetLowStockAsync(int take)
    {
        var threshold = LowStockThreshold;
        return await _db.Products.AsNoTracking()
            .Where(p => p.IsActive && p.StockQuantity <= threshold)
            .OrderBy(p => p.StockQuantity).ThenBy(p => p.Name)
            .Take(take)
            .Select(p => new LowStockProductDto(p.Id, p.Name, p.Sku, p.StockQuantity))
            .ToListAsync();
    }
}
