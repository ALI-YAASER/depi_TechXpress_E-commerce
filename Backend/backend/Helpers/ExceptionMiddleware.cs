namespace backend.Helpers;

/// <summary>يسجّل أي خطأ غير متوقع. في Development بيعرض سبب الخطأ، وفي Production رسالة عامة.</summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try { await _next(context); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
            if (context.Response.HasStarted) throw;
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var message = _env.IsDevelopment()
                ? ex.GetBaseException().Message
                : "An unexpected error occurred.";
            await context.Response.WriteAsJsonAsync(ApiResponse.Fail(message));
        }
    }
}