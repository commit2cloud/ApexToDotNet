using Microsoft.EntityFrameworkCore;
using ApexToDotNet.API.Models;
using ApexToDotNet.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Temporarily disable Swagger due to .NET 10 compatibility
// builder.Services.AddSwaggerGen();

// Add ORDS API Client
builder.Services.AddHttpClient<OrdsApiClient>();

// Configure CORS for Angular app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add DbContext with InMemory provider for now
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("StrategicPlannerDb"));

var app = builder.Build();

// Ensure the InMemory database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Temporarily disable Swagger due to .NET 10 compatibility
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

// Add a simple root endpoint
app.MapGet("/", () => new
{
    Application = "Strategic Planner API",
    Status = "Running",
    Version = "1.0.0",
    Environment = app.Environment.EnvironmentName,
    Description = "REST API for Strategic Planner - Oracle APEX Migration",
    Endpoints = new[]
    {
        "/api/health - Basic health check",
        "/api/health/database - Test database connection",
        "/api/projects - Project management",
        "/api/dashboard/counts - Navigation counts",
        "/api/dashboard/areas - Areas list",
        "/api/dashboard/initiatives - Initiatives list",
        "/api/dashboard/activities - Activities list",
        "/api/dashboard/people - People list"
    }
});

app.Run();
