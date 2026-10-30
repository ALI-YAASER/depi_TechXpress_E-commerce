namespace backend.Helpers;

public static class OrderStatuses
{
    public const string Pending = "Pending", Processing = "Processing", Shipped = "Shipped",
                        Delivered = "Delivered", Cancelled = "Cancelled";

    public static readonly string[] All = { Pending, Processing, Shipped, Delivered, Cancelled };

    // الانتقالات المسموحة فقط. Delivered و Cancelled نهائيين.
    private static readonly Dictionary<string, string[]> Allowed = new()
    {
        [Pending] = new[] { Processing, Cancelled },
        [Processing] = new[] { Shipped, Cancelled },
        [Shipped] = new[] { Delivered },
        [Delivered] = Array.Empty<string>(),
        [Cancelled] = Array.Empty<string>()
    };

    public static bool CanTransition(string from, string to) =>
        Allowed.TryGetValue(from, out var next) && next.Contains(to);

    /// <summary>يرجّع الاسم الرسمي للحالة (بغض النظر عن حالة الحروف) أو null لو غير معروفة.</summary>
    public static string? Normalize(string? value) =>
        All.FirstOrDefault(s => string.Equals(s, value?.Trim(), StringComparison.OrdinalIgnoreCase));
}

public static class PaymentStatuses
{
    public const string Pending = "Pending", Paid = "Paid", Failed = "Failed",
                        Cancelled = "Cancelled", Refunded = "Refunded";
}

public static class PaymentProviders
{
    public const string CashOnDelivery = "CashOnDelivery", Stripe = "Stripe";
}
