using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ErikHedakerApp
{
    public class Startup
    {
        public Startup( IConfiguration configuration )
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices( IServiceCollection services )
        {
            services.AddSingleton<IDungeoncrawlerProcessHandler, DungeoncrawlerProcessHandler>( );
            services.AddControllersWithViews( );

            services.AddSpaStaticFiles( configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            } );
        }
        public void Configure( IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory )
        {
            loggerFactory.AddFile( "Logs/Log-{Date}.txt" );
            app.UseMiddleware<RequestLoggingMiddleware>( );
            app.ApplicationServices.GetService<IDungeoncrawlerProcessHandler>( );

            app.UseForwardedHeaders( new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            } );

            if( env.IsDevelopment( ) )
            {
                app.UseDeveloperExceptionPage( );
            }

            app.UseStaticFiles( );
            app.UseSpaStaticFiles( );
            app.UseRouting( );

            app.UseEndpoints( endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}" );
            } );
            app.UseSpa( spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if( env.IsDevelopment( ) )
                {
                    spa.UseReactDevelopmentServer( npmScript: "start" );
                }
            } );
        }
    }
}