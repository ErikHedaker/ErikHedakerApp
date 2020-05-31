using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace ErikHedakerApp
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public RequestLoggingMiddleware( RequestDelegate next, ILoggerFactory loggerFactory )
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<RequestLoggingMiddleware>( );
        }
        public async Task Invoke( HttpContext context )
        {
            HttpRequestRewindExtensions.EnableBuffering( context.Request );

            var buffer = new byte[ Convert.ToInt32( context.Request.ContentLength ) ];
            await context.Request.Body.ReadAsync( buffer, 0, buffer.Length );
            var requestBody = Encoding.UTF8.GetString( buffer );
            context.Request.Body.Seek( 0, SeekOrigin.Begin );

            var builder = new StringBuilder( Environment.NewLine );
            foreach( var header in context.Request.Headers )
            {
                builder.AppendLine( $"{header.Key}:{header.Value}" );
            }

            builder.AppendLine( $"Request body:{requestBody}" );

            _logger.LogInformation( builder.ToString( ) );

            await _next( context );
        }
    }
}