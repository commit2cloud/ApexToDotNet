using Microsoft.AspNetCore.Mvc;
using ApexToDotNet.API.Services;
using static ApexToDotNet.API.Models.StrategicPlannerModels;

namespace ApexToDotNet.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly OrdsApiClient _ordsClient;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(OrdsApiClient ordsClient, ILogger<ProjectsController> logger)
        {
            _ordsClient = ordsClient;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects(
            [FromQuery] int? areaId = null,
            [FromQuery] int? priority = null,
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                // Build query parameters
                var queryParams = new List<string>();
                if (areaId.HasValue) queryParams.Add($"area_id={areaId.Value}");
                if (priority.HasValue) queryParams.Add($"priority={priority.Value}");
                if (!string.IsNullOrEmpty(status)) queryParams.Add($"status={status}");
                queryParams.Add($"page={page}");
                queryParams.Add($"limit={pageSize}");

                var endpoint = $"api/projects?{string.Join("&", queryParams)}";
                var result = await _ordsClient.GetAsync<SearchResult<Project>>(endpoint);

                if (result == null)
                {
                    return Ok(new List<Project>());
                }

                return Ok(result.Items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects");
                return StatusCode(500, new { error = "Failed to retrieve projects", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            try
            {
                var endpoint = $"api/projects/{id}";
                var project = await _ordsClient.GetAsync<Project>(endpoint);

                if (project == null)
                {
                    return NotFound(new { error = $"Project with ID {id} not found" });
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving project {ProjectId}", id);
                return StatusCode(500, new { error = "Failed to retrieve project", details = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Project>>> SearchProjects(
            [FromQuery] string? query = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var queryParams = new List<string>();
                if (!string.IsNullOrEmpty(query)) queryParams.Add($"q={Uri.EscapeDataString(query)}");
                queryParams.Add($"page={page}");
                queryParams.Add($"limit={pageSize}");

                var endpoint = $"api/projects/search?{string.Join("&", queryParams)}";
                var result = await _ordsClient.GetAsync<SearchResult<Project>>(endpoint);

                if (result == null)
                {
                    return Ok(new List<Project>());
                }

                return Ok(result.Items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching projects with query: {Query}", query);
                return StatusCode(500, new { error = "Failed to search projects", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] Project project)
        {
            try
            {
                var endpoint = "api/projects";
                var result = await _ordsClient.PostAsync<Project>(endpoint, project);

                if (result == null)
                {
                    return StatusCode(500, new { error = "Failed to create project" });
                }

                return CreatedAtAction(nameof(GetProject), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating project");
                return StatusCode(500, new { error = "Failed to create project", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Project>> UpdateProject(int id, [FromBody] Project project)
        {
            try
            {
                if (id != project.Id)
                {
                    return BadRequest(new { error = "Project ID mismatch" });
                }

                var endpoint = $"api/projects/{id}";
                var result = await _ordsClient.PutAsync<Project>(endpoint, project);

                if (result == null)
                {
                    return NotFound(new { error = $"Project with ID {id} not found" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating project {ProjectId}", id);
                return StatusCode(500, new { error = "Failed to update project", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            try
            {
                var endpoint = $"api/projects/{id}";
                var success = await _ordsClient.DeleteAsync(endpoint);

                if (!success)
                {
                    return NotFound(new { error = $"Project with ID {id} not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting project {ProjectId}", id);
                return StatusCode(500, new { error = "Failed to delete project", details = ex.Message });
            }
        }
    }
}
