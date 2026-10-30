namespace backend.Helpers;

/// <summary>شكل موحّد لكل رسائل الخطأ في الـ API.</summary>
public class ApiResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public IDictionary<string, string[]>? Errors { get; set; }

    public static ApiResponse Fail(string message, IDictionary<string, string[]>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors };
}
