using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System.Text;

namespace ApexToDotNet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<HealthController> _logger;

        public HealthController(IConfiguration configuration, ILogger<HealthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        // GET: api/Health
        [HttpGet]
        public async Task<ActionResult<object>> GetHealth()
        {
            var result = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Environment = _configuration["ASPNETCORE_ENVIRONMENT"] ?? "Unknown"
            };

            return Ok(result);
        }

        // GET: api/Health/database
        [HttpGet("database")]
        public async Task<ActionResult<object>> TestDatabaseConnection()
        {
            var connectionString = _configuration.GetConnectionString("OracleAPEX");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                return BadRequest(new { 
                    Error = "Connection string not configured",
                    Message = "OracleAPEX connection string is missing in appsettings.json"
                });
            }

            try
            {
                using (var connection = new OracleConnection(connectionString))
                {
                    _logger.LogInformation("Attempting to connect to Oracle database...");
                    
                    await connection.OpenAsync();
                    
                    _logger.LogInformation("✅ Connection successful!");

                    var results = new Dictionary<string, string>();

                    // Get database version
                    using (var cmd = connection.CreateCommand())
                    {
                        cmd.CommandText = "SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1";
                        var version = await cmd.ExecuteScalarAsync();
                        results["DatabaseVersion"] = version?.ToString() ?? "Unknown";
                    }

                    // Get current user
                    using (var cmd = connection.CreateCommand())
                    {
                        cmd.CommandText = "SELECT USER FROM DUAL";
                        var user = await cmd.ExecuteScalarAsync();
                        results["ConnectedAs"] = user?.ToString() ?? "Unknown";
                    }

                    // Get service name
                    using (var cmd = connection.CreateCommand())
                    {
                        cmd.CommandText = "SELECT SYS_CONTEXT('USERENV', 'SERVICE_NAME') FROM DUAL";
                        var serviceName = await cmd.ExecuteScalarAsync();
                        results["ServiceName"] = serviceName?.ToString() ?? "Unknown";
                    }

                    // Get database name
                    using (var cmd = connection.CreateCommand())
                    {
                        cmd.CommandText = "SELECT SYS_CONTEXT('USERENV', 'DB_NAME') FROM DUAL";
                        var dbName = await cmd.ExecuteScalarAsync();
                        results["DatabaseName"] = dbName?.ToString() ?? "Unknown";
                    }

                    // Try to query APEX workspaces
                    try
                    {
                        using (var cmd = connection.CreateCommand())
                        {
                            cmd.CommandText = "SELECT COUNT(*) FROM apex_workspaces WHERE workspace = 'APEXDOTNET'";
                            var count = await cmd.ExecuteScalarAsync();
                            results["ApexWorkspaceFound"] = count?.ToString() == "1" ? "Yes" : "No";
                        }
                    }
                    catch (Exception ex)
                    {
                        results["ApexWorkspaceFound"] = $"Cannot query: {ex.Message}";
                    }

                    return Ok(new
                    {
                        Status = "✅ Connection Successful",
                        Timestamp = DateTime.UtcNow,
                        ConnectionDetails = results
                    });
                }
            }
            catch (OracleException oex)
            {
                _logger.LogError(oex, "Oracle connection failed");
                
                var errorInfo = new
                {
                    Status = "❌ Connection Failed",
                    ErrorCode = oex.Number,
                    ErrorMessage = oex.Message,
                    Timestamp = DateTime.UtcNow,
                    Hint = GetOracleErrorHint(oex.Number)
                };

                return StatusCode(500, errorInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Connection test failed");
                
                return StatusCode(500, new
                {
                    Status = "❌ Connection Failed",
                    Error = ex.Message,
                    Type = ex.GetType().Name,
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        private string GetOracleErrorHint(int errorCode)
        {
            return errorCode switch
            {
                1017 => "Invalid username or password. Check your credentials in .env file.",
                12154 => "TNS: could not resolve service name. Check the service name in connection string.",
                12514 => "TNS: listener does not currently know of service. Database may be down.",
                12541 => "TNS: no listener. Check host and port.",
                12545 => "Connection failed because target host or object does not exist.",
                28000 => "Account is locked. Unlock the account in OCI Console.",
                _ => $"Oracle error {errorCode}. Check Oracle documentation for details."
            };
        }
    }
}
