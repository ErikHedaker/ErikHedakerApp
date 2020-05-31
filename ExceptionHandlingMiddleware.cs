using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ErikHedakerApp
{
    public class ExceptionInfo
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }

        public override string ToString( )
        {
            return JsonConvert.SerializeObject( this );
        }
    }

    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ExceptionHandlingMiddleware( RequestDelegate next, ILoggerFactory loggerFactory )
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<RequestLoggingMiddleware>( );
        }
        public async Task InvokeAsync( HttpContext httpContext )
        {
            try
            {
                await _next( httpContext );
            }
            catch( Exception ex )
            {
                _logger.LogError( $"Exception: {ex}" );
                await HandleExceptionAsync( httpContext, ex );
            }
        }
        private static Task HandleExceptionAsync( HttpContext context, Exception exception )
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            return context.Response.WriteAsync( new ExceptionInfo( )
            {
                StatusCode = context.Response.StatusCode,
                Message = "Internal Server Error"
            }.ToString( ) );
        }
    }
}