using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(CorsPolicyBuilder => CorsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
app.UseAuthentication(); // DO YOU HAVE A AVALID TOKEN
app.UseAuthorization(); // YOU HAVE A VALID TOKEN, WHAT ARE YOU ALLOWED TO DO
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//gives us access to all the services we have in this program.cs class
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

//this is not an HTTP request so we need to handle any exceptions here
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager);
}
catch(Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
