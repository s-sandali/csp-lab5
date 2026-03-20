var builder = WebApplication.CreateBuilder(args);

const string ReactLocalOrigin = "ReactLocalOrigin";

builder.Services.AddCors(options =>
{
    options.AddPolicy(ReactLocalOrigin, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(ReactLocalOrigin);

app.MapGet("/", () => Results.Ok(new
{
    application = "Lab 5 Backend API",
    status = "Running",
    docs = "Use GET /api/health to verify the API from the React app."
}));

app.MapGet("/api/health", (IHostEnvironment environment) =>
{
    return Results.Ok(new
    {
        message = "Hello from the ASP.NET Core Web API.",
        environment = environment.EnvironmentName,
        timestamp = DateTimeOffset.UtcNow
    });
})
.WithName("GetHealthStatus");

app.Run();
