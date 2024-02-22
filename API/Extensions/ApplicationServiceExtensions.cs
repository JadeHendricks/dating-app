using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<DataContext>(options => 
        {
            options.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });

        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<LogUserActivity>(); //we can be specific on where we actually want to use this (BaseApiController)
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>();
        //automapper comes with it's own implementation
        //we need to tell automapper where our mapping profiles are
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings")); //use CloudinarySettings and get the config from CloudinarySettings

        return services;
    }
}
