using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(CorsPolicyBuilder => CorsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
app.UseAuthentication(); // DO YOU HAVE A AVALID TOKEN
app.UseAuthorization(); // YOU HAVE A VALID TOKEN, WHAT ARE YOU ALLOWED TO DO
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
