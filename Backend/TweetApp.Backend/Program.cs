using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;
using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Mapper;
using TweetApp.Backend.Rabbitmq;
using TweetApp.Backend.Repository;
using TweetApp.Backend.ServiceBus;
using TweetApp.Backend.SwaggerConfiguration;

namespace TweetApp.Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {

            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.ApplicationInsights(new Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration { InstrumentationKey = "2979165b-ce9a-4813-9f68-801e01e786fc" }, TelemetryConverter.Traces)
                .WriteTo.File(new CompactJsonFormatter(), "logs/my-logs.txt", rollingInterval: RollingInterval.Hour, restrictedToMinimumLevel: LogEventLevel.Information)
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
                .CreateLogger();


            try
            {
                Log.Information("Starting web host");
                var builder = WebApplication.CreateBuilder(args);
                builder.Logging.AddConsole();


                //builder.Host.UseSerilog((ctx, lc) => lc.WriteTo.Console());
                builder.Host.UseSerilog();

                //builder.Host.UseSerilog();

                builder.Services.AddCors();

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile(new Mappings());
                });

                var mapper = config.CreateMapper();

                // Add services to the container.

                builder.Services.AddControllers();
                builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
                //builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), providerOptions => providerOptions.EnableRetryOnFailure()));
                builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
                builder.Services.AddScoped<IRabbitMQMessageSender, RabbitMQMessageSender>();
                builder.Services.AddScoped<IServiceBusSender, ServiceBusSender>();
                builder.Services.AddSingleton(mapper);

                builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
                builder.Services.AddSwaggerGen();

                // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                builder.Services.AddApiVersioning(options =>
                {
                    options.AssumeDefaultVersionWhenUnspecified = true;
                    options.DefaultApiVersion = new ApiVersion(1, 0);
                    options.ReportApiVersions = true;
                });

                builder.Services.AddVersionedApiExplorer(options => options.GroupNameFormat = "'v'VVV");

                var appSettingsSection = builder.Configuration.GetSection("AppSettings");
                builder.Services.Configure<AppSettings>(appSettingsSection);
                var appSettings = appSettingsSection.Get<AppSettings>();
                var key = Encoding.ASCII.GetBytes(appSettings.Secret);

                builder.Services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                    .AddJwtBearer(x =>
                    {
                        x.RequireHttpsMetadata = false;
                        x.SaveToken = true;
                        x.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(key),
                            ValidateIssuer = false,
                            ValidateAudience = false
                        };
                    });

                var app = builder.Build();

                // Configure the HTTP request pipeline.

                app.UseSwagger();
                app.UseSwaggerUI();


                //app.UseRabbitListener();
                app.UseHttpsRedirection();
                app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
                app.UseAuthentication();
                app.UseAuthorization();
                app.UseSerilogRequestLogging();

                app.MapControllers();

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }



        }
    }
}
