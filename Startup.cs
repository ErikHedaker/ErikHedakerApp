using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Net;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Logging.Debug;
using Microsoft.Extensions.Logging.EventSource;
using Microsoft.Extensions.Logging.TraceSource;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Diagnostics;
using System.IO;

namespace ErikHedakerApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IDungeoncrawlerProcessHandler, DungeoncrawlerProcessHandler>();
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.KnownProxies.Add(IPAddress.Parse("78.82.211.90"));
                options.KnownProxies.Add(IPAddress.Parse("127.0.0.1"));
                options.KnownProxies.Add(IPAddress.Parse("134.122.77.196"));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddFile("Logs/Log-{Date}.txt");
            app.ApplicationServices.GetService<IDungeoncrawlerProcessHandler>();

            app.UseMiddleware<RequestLoggingMiddleware>();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseAuthentication(); //testaddition
            //app.UseStatusCodePages(); //testaddition
            //app.UseHttpsRedirection(); //testaddition

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(errorApp =>
                {
                    errorApp.Run(async context =>
                    {
                        var exceptionHandlerPathFeature =
                            context.Features.Get<IExceptionHandlerPathFeature>();
                        ILogger logger = loggerFactory.CreateLogger<IExceptionHandlerPathFeature>();
                        logger.LogInformation(exceptionHandlerPathFeature?.Error.Message);

                        // Use exceptionHandlerPathFeature to process the exception (for example, 
                        // logging), but do NOT expose sensitive error information directly to 
                        // the client.
                    });
                });
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();

            app.UseRequestLocalization();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
