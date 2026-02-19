using Microsoft.AspNetCore.Mvc;
using ApexToDotNet.API.Services;
using static ApexToDotNet.API.Models.StrategicPlannerModels;

namespace ApexToDotNet.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly OrdsApiClient _ordsClient;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(OrdsApiClient ordsClient, ILogger<DashboardController> logger)
        {
            _ordsClient = ordsClient;
            _logger = logger;
        }

        [HttpGet("counts")]
        public async Task<ActionResult<NavigationCounts>> GetNavigationCounts()
        {
            try
            {
                var endpoint = "api/dashboard/counts";
                var counts = await _ordsClient.GetAsync<NavigationCounts>(endpoint);

                if (counts == null)
                {
                    // Return default counts if ORDS endpoint not set up yet
                    return Ok(new NavigationCounts
                    {
                        Projects = 0,
                        Areas = 0,
                        Initiatives = 0,
                        Activities = 0,
                        People = 0,
                        ProjectGroups = 0,
                        PersonGroups = 0,
                        Releases = 0
                    });
                }

                return Ok(counts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving navigation counts");
                return StatusCode(500, new { error = "Failed to retrieve counts", details = ex.Message });
            }
        }

        [HttpGet("areas")]
        public async Task<ActionResult<IEnumerable<Area>>> GetAreas()
        {
            try
            {
                var endpoint = "api/areas";
                var result = await _ordsClient.GetAsync<SearchResult<Area>>(endpoint);

                if (result == null)
                {
                    return Ok(new List<Area>());
                }

                return Ok(result.Items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving areas");
                return StatusCode(500, new { error = "Failed to retrieve areas", details = ex.Message });
            }
        }

        [HttpGet("initiatives")]
        public async Task<ActionResult<IEnumerable<Initiative>>> GetInitiatives([FromQuery] int? areaId = null)
        {
            try
            {
                var queryParams = new List<string>();
                if (areaId.HasValue) queryParams.Add($"area_id={areaId.Value}");

                var endpoint = $"api/initiatives?{string.Join("&", queryParams)}";
                var result = await _ordsClient.GetAsync<SearchResult<Initiative>>(endpoint);

                if (result == null)
                {
                    return Ok(new List<Initiative>());
                }

                return Ok(result.Items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving initiatives");
                return StatusCode(500, new { error = "Failed to retrieve initiatives", details = ex.Message });
            }
        }

        [HttpGet("activities")]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities(
            [FromQuery] int? projectId = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var queryParams = new List<string>();
                if (projectId.HasValue) queryParams.Add($"project_id={projectId.Value}");
                if (!string.IsNullOrEmpty(status)) queryParams.Add($"status={status}");

                var endpoint = $"api/activities?{string.Join("&", queryParams)}";
                var result = await _ordsClient.GetAsync<SearchResult<Activity>>(endpoint);

                if (result == null)
                {
                    return Ok(new List<Activity>());
                }

                return Ok(result.Items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving activities");
                return StatusCode(500, new { error = "Failed to retrieve activities", details = ex.Message });
            }
        }

        [HttpGet("people")]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople()
        {
            try
            {
                var endpoint = "api/people";
                var result = await _ordsClient.GetAsync<SearchResult<Person>>(endpoint);

                if (result == null)
                {
                    return Ok(new List<Person>());
                }

                return Ok(result.Items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving people");
                return StatusCode(500, new { error = "Failed to retrieve people", details = ex.Message });
            }
        }
    }
}
