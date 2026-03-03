using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApexToDotNet.API.Models;

namespace ApexToDotNet.API.Controllers
{
    /// <summary>
    /// Strategic Planner Projects API
    /// Maps to APEX Pages: 23 (list), 24 (create/edit modal), 3 (detail)
    /// </summary>
    [Route("api/sp/[controller]")]
    [ApiController]
    public class SpProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SpProjectsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProjects()
        {
            var projects = await _context.SpProjects
                .Include(p => p.Owner)
                .Include(p => p.Initiative)
                    .ThenInclude(i => i!.Area)
                .Include(p => p.Release)
                .Include(p => p.Status)
                .Include(p => p.Priority)
                .Where(p => p.ArchivedYn != "Y" && p.DuplicateOfProjectId == null)
                .Select(p => new
                {
                    p.Id,
                    p.ProjectName,
                    Owner = p.Owner != null ? p.Owner.FirstName + " " + p.Owner.LastName : "(No Owner)",
                    p.OwnerId,
                    Area = p.Initiative != null && p.Initiative.Area != null ? p.Initiative.Area.AreaName : "Not Identified",
                    Initiative = p.Initiative != null ? p.Initiative.InitiativeName : null,
                    p.InitiativeId,
                    Release = p.Release != null ? p.Release.ReleaseTrain + " " + p.Release.ReleaseName : null,
                    p.ReleaseId,
                    Status = p.Status != null ? p.Status.Status : null,
                    p.StatusId,
                    Priority = p.Priority != null ? "P" + p.Priority.Priority : null,
                    p.PriorityId,
                    p.PctComplete,
                    p.TargetComplete,
                    p.ProjectSize,
                    p.Tags,
                    p.Updated
                })
                .OrderBy(p => p.ProjectName)
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SpProject>> GetProject(int id)
        {
            var project = await _context.SpProjects
                .Include(p => p.Owner)
                .Include(p => p.Initiative)
                .Include(p => p.Release)
                .Include(p => p.Status)
                .Include(p => p.Priority)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<SpProject>> CreateProject(SpProject project)
        {
            project.Created = System.DateTime.UtcNow;
            project.Updated = System.DateTime.UtcNow;
            project.CreatedBy = "ADMIN";
            project.UpdatedBy = "ADMIN";
            _context.SpProjects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, SpProject project)
        {
            if (id != project.Id) return BadRequest();
            project.Updated = System.DateTime.UtcNow;
            project.UpdatedBy = "ADMIN";
            _context.Entry(project).State = EntityState.Modified;
            _context.Entry(project).Property(x => x.Created).IsModified = false;
            _context.Entry(project).Property(x => x.CreatedBy).IsModified = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.SpProjects.FindAsync(id);
            if (project == null) return NotFound();
            _context.SpProjects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [Route("api/sp/[controller]")]
    [ApiController]
    public class InitiativesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public InitiativesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetInitiatives()
        {
            return Ok(await _context.Initiatives
                .Include(i => i.Area)
                .Include(i => i.Sponsor)
                .Where(i => i.ArchivedYn != "Y")
                .Select(i => new
                {
                    i.Id,
                    i.InitiativeName,
                    i.Objective,
                    Area = i.Area != null ? i.Area.AreaName : null,
                    i.AreaId,
                    Sponsor = i.Sponsor != null ? i.Sponsor.FirstName + " " + i.Sponsor.LastName : null,
                    i.SponsorId,
                    ActiveProjects = _context.SpProjects.Count(p => p.InitiativeId == i.Id && p.ArchivedYn != "Y"),
                    i.StatusScale,
                    i.Updated
                })
                .OrderBy(i => i.InitiativeName)
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Initiative>> GetInitiative(int id)
        {
            var item = await _context.Initiatives.Include(i => i.Area).Include(i => i.Sponsor).FirstOrDefaultAsync(i => i.Id == id);
            if (item == null) return NotFound();
            return item;
        }
    }

    [Route("api/sp/[controller]")]
    [ApiController]
    public class AreasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AreasController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAreas()
        {
            return Ok(await _context.Areas.Select(a => new
            {
                a.Id,
                a.AreaName,
                a.Description,
                Initiatives = _context.Initiatives.Count(i => i.AreaId == a.Id && i.ArchivedYn != "Y"),
                Projects = _context.SpProjects.Count(p => p.Initiative != null && p.Initiative.AreaId == a.Id && p.ArchivedYn != "Y")
            }).ToListAsync());
        }
    }

    [Route("api/sp/[controller]")]
    [ApiController]
    public class ReleasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReleasesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetReleases()
        {
            return Ok(await _context.Releases
                .Include(r => r.Owner)
                .Select(r => new
                {
                    r.Id,
                    r.ReleaseTrain,
                    r.ReleaseName,
                    ReleaseOwner = r.Owner != null ? r.Owner.FirstName + " " + r.Owner.LastName : "(No Owner)",
                    r.ReleaseTargetDate,
                    r.ReleaseOpenDate,
                    r.ReleaseCompleted,
                    r.ReleaseOpenCompleted,
                    r.ReleaseType,
                    Projects = _context.SpProjects.Count(p => p.ReleaseId == r.Id),
                    AvgPctComplete = _context.SpProjects.Where(p => p.ReleaseId == r.Id).Average(p => (double?)p.PctComplete) ?? 0,
                    r.Updated
                })
                .OrderByDescending(r => r.ReleaseTargetDate)
                .ToListAsync());
        }
    }

    [Route("api/sp/[controller]")]
    [ApiController]
    public class TeamMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TeamMembersController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
        {
            return Ok(await _context.TeamMembers
                .Where(t => t.IsCurrentYn == "Y")
                .OrderBy(t => t.LastName)
                .ThenBy(t => t.FirstName)
                .ToListAsync());
        }
    }

    [Route("api/sp/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ActivitiesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetActivities()
        {
            return Ok(await _context.Activities
                .Include(a => a.Project)
                .Include(a => a.TeamMember)
                .Select(a => new
                {
                    a.Id,
                    a.Comments,
                    Project = a.Project != null ? a.Project.ProjectName : null,
                    a.ProjectId,
                    Person = a.TeamMember != null ? a.TeamMember.FirstName + " " + a.TeamMember.LastName : null,
                    a.TeamMemberId,
                    a.StartDate,
                    a.EndDate,
                    a.Tags,
                    a.Updated
                })
                .OrderByDescending(a => a.Updated)
                .ToListAsync());
        }
    }

    [Route("api/sp/[controller]")]
    [ApiController]
    public class LookupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public LookupsController(ApplicationDbContext context) => _context = context;

        [HttpGet("statuses")]
        public async Task<ActionResult<IEnumerable<ProjectStatus>>> GetStatuses()
            => Ok(await _context.ProjectStatuses.Where(s => s.IncludeYn == "Y").OrderBy(s => s.DisplaySeq).ToListAsync());

        [HttpGet("priorities")]
        public async Task<ActionResult<IEnumerable<ProjectPriority>>> GetPriorities()
            => Ok(await _context.ProjectPriorities.OrderBy(p => p.Priority).ToListAsync());

        [HttpGet("activity-types")]
        public async Task<ActionResult<IEnumerable<ActivityType>>> GetActivityTypes()
            => Ok(await _context.ActivityTypes.Where(a => a.IsActiveYn == "Y").OrderBy(a => a.DisplaySequence).ToListAsync());

        [HttpGet("task-types")]
        public async Task<ActionResult<IEnumerable<TaskType>>> GetTaskTypes()
            => Ok(await _context.TaskTypes.OrderBy(t => t.TaskTypeName).ToListAsync());
    }

    /// <summary>
    /// Project Groups API
    /// Maps to APEX Pages: 70 (list), 90 (edit modal)
    /// </summary>
    [Route("api/sp/[controller]")]
    [ApiController]
    public class ProjectGroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProjectGroupsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProjectGroups()
        {
            return Ok(await _context.ProjectGroups
                .Select(g => new
                {
                    g.Id,
                    g.GroupName,
                    g.Description,
                    Projects = _context.SpProjects.Count(p => p.ProjectGroupId == g.Id && p.ArchivedYn != "Y"),
                    g.Updated
                })
                .OrderBy(g => g.GroupName)
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectGroup>> GetProjectGroup(int id)
        {
            var item = await _context.ProjectGroups.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<ProjectGroup>> CreateProjectGroup(ProjectGroup group)
        {
            group.Created = System.DateTime.UtcNow;
            group.Updated = System.DateTime.UtcNow;
            group.CreatedBy = "ADMIN";
            group.UpdatedBy = "ADMIN";
            _context.ProjectGroups.Add(group);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProjectGroup), new { id = group.Id }, group);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectGroup(int id, ProjectGroup group)
        {
            if (id != group.Id) return BadRequest();
            group.Updated = System.DateTime.UtcNow;
            group.UpdatedBy = "ADMIN";
            _context.Entry(group).State = EntityState.Modified;
            _context.Entry(group).Property(x => x.Created).IsModified = false;
            _context.Entry(group).Property(x => x.CreatedBy).IsModified = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectGroup(int id)
        {
            var item = await _context.ProjectGroups.FindAsync(id);
            if (item == null) return NotFound();
            _context.ProjectGroups.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    /// <summary>
    /// People Groups API
    /// Maps to APEX Pages: 103 (list), 150 (edit modal), 151 (members), 152 (member edit)
    /// </summary>
    [Route("api/sp/[controller]")]
    [ApiController]
    public class PeopleGroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PeopleGroupsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPeopleGroups()
        {
            return Ok(await _context.PeopleGroups
                .Select(g => new
                {
                    g.Id,
                    g.GroupName,
                    g.GroupDescription,
                    g.GroupTag,
                    Members = _context.GroupMembers.Count(m => m.GroupId == g.Id),
                    g.Updated
                })
                .OrderBy(g => g.GroupName)
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPeopleGroup(int id)
        {
            var group = await _context.PeopleGroups.FindAsync(id);
            if (group == null) return NotFound();

            var members = await _context.GroupMembers
                .Include(m => m.TeamMember)
                .Where(m => m.GroupId == id)
                .Select(m => new
                {
                    m.Id,
                    m.TeamMemberId,
                    Name = m.TeamMember != null ? m.TeamMember.FirstName + " " + m.TeamMember.LastName : null,
                    m.GroupLeaderYn,
                    AddedToGroup = m.Created
                })
                .ToListAsync();

            return Ok(new
            {
                group.Id,
                group.GroupName,
                group.GroupDescription,
                group.GroupTag,
                Members = members
            });
        }

        [HttpPost]
        public async Task<ActionResult<PeopleGroup>> CreatePeopleGroup(PeopleGroup group)
        {
            group.Created = System.DateTime.UtcNow;
            group.Updated = System.DateTime.UtcNow;
            group.CreatedBy = "ADMIN";
            group.UpdatedBy = "ADMIN";
            _context.PeopleGroups.Add(group);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPeopleGroup), new { id = group.Id }, group);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePeopleGroup(int id)
        {
            var item = await _context.PeopleGroups.FindAsync(id);
            if (item == null) return NotFound();
            _context.PeopleGroups.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
