using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(options => 
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(CorsPolicyBuilder => CorsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
