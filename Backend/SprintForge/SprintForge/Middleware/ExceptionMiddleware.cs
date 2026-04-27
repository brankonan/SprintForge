using System.Net;
using System.Text.Json;
using SprintForge.Exceptions;

namespace SprintForge.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning("Not found: {Message} | Path: {Path}", ex.Message, context.Request.Path);
            await WriteResponse(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (ForbiddenException ex)
        {
            _logger.LogWarning("Forbidden: {Message} | Path: {Path}", ex.Message, context.Request.Path);
            await WriteResponse(context, HttpStatusCode.Forbidden, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception | Path: {Path}", context.Request.Path);
            await WriteResponse(context, HttpStatusCode.BadRequest, ex.Message);
        }
    }

    private static async Task WriteResponse(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var body = JsonSerializer.Serialize(new { message });
        await context.Response.WriteAsync(body);
    }
}
