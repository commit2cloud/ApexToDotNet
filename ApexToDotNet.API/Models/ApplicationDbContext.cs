using Microsoft.EntityFrameworkCore;

namespace ApexToDotNet.API.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Core entities (matching SP_ tables from Strategic Planner)
        public DbSet<Area> Areas { get; set; }
        public DbSet<Initiative> Initiatives { get; set; }
        public DbSet<SpProject> SpProjects { get; set; }
        public DbSet<Release> Releases { get; set; }
        public DbSet<SpTask> SpTasks { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }

        // Lookups
        public DbSet<ProjectStatus> ProjectStatuses { get; set; }
        public DbSet<ProjectPriority> ProjectPriorities { get; set; }
        public DbSet<ActivityType> ActivityTypes { get; set; }
        public DbSet<TaskType> TaskTypes { get; set; }
        public DbSet<TaskStatus> TaskStatuses { get; set; }

        // Groups
        public DbSet<ProjectGroup> ProjectGroups { get; set; }
        public DbSet<PeopleGroup> PeopleGroups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }

        // Legacy (kept for backward compat)
        public DbSet<Project> Projects { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<ApexToDotNet.API.Models.Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data matching what we found in the APEX database
            SeedTeamMembers(modelBuilder);
            SeedAreas(modelBuilder);
            SeedLookups(modelBuilder);
            SeedInitiatives(modelBuilder);
            SeedReleases(modelBuilder);
            SeedProjects(modelBuilder);
            SeedActivities(modelBuilder);
            SeedTasks(modelBuilder);
            SeedGroups(modelBuilder);
        }

        private static void SeedTeamMembers(ModelBuilder mb)
        {
            mb.Entity<TeamMember>().HasData(
                new TeamMember { Id = 1, FirstName = "John", LastName = "Doe", Initials = "JD", Email = "john.doe@example.com", IsCurrentYn = "Y", AppRole = "ADMINISTRATOR", Location = "New York", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" },
                new TeamMember { Id = 2, FirstName = "Jane", LastName = "Doe", Initials = "JD", Email = "jane.doe@example.com", IsCurrentYn = "Y", AppRole = "CONTRIBUTOR", Location = "Chicago", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" },
                new TeamMember { Id = 3, FirstName = "Scott", LastName = "Tiger", Initials = "ST", Email = "scott.tiger@example.com", IsCurrentYn = "Y", AppRole = "CONTRIBUTOR", Location = "San Francisco", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" }
            );
        }

        private static void SeedAreas(ModelBuilder mb)
        {
            mb.Entity<Area>().HasData(
                new Area { Id = 1, AreaName = "Alpha", Description = "Alpha program area", OwnerId = 1, Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" },
                new Area { Id = 2, AreaName = "Beta", Description = "Beta program area", OwnerId = 2, Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" }
            );
        }

        private static void SeedLookups(ModelBuilder mb)
        {
            mb.Entity<ProjectStatus>().HasData(
                new ProjectStatus { Id = 1, Status = "Open", StaticId = "OPEN", DisplaySeq = 10, IncludeYn = "Y" },
                new ProjectStatus { Id = 2, Status = "On-Hold", StaticId = "ON_HOLD", DisplaySeq = 20, IncludeYn = "Y" },
                new ProjectStatus { Id = 3, Status = "Closed", StaticId = "CLOSED", DisplaySeq = 30, IncludeYn = "Y" },
                new ProjectStatus { Id = 4, Status = "Cancelled", StaticId = "CANCELLED", DisplaySeq = 40, IncludeYn = "Y" }
            );
            mb.Entity<ProjectPriority>().HasData(
                new ProjectPriority { Id = 1, Priority = 1, Description = "Critical", IsDefaultYn = "N" },
                new ProjectPriority { Id = 2, Priority = 2, Description = "High", IsDefaultYn = "N" },
                new ProjectPriority { Id = 3, Priority = 3, Description = "Medium", IsDefaultYn = "Y" },
                new ProjectPriority { Id = 4, Priority = 4, Description = "Low", IsDefaultYn = "N" },
                new ProjectPriority { Id = 5, Priority = 5, Description = "Nice to Have", IsDefaultYn = "N" }
            );
            mb.Entity<ActivityType>().HasData(
                new ActivityType { Id = 1, DisplaySequence = 10, ActivityTypeName = "Development", IsActiveYn = "Y" },
                new ActivityType { Id = 2, DisplaySequence = 20, ActivityTypeName = "Testing", IsActiveYn = "Y" },
                new ActivityType { Id = 3, DisplaySequence = 30, ActivityTypeName = "Documentation", IsActiveYn = "Y" },
                new ActivityType { Id = 4, DisplaySequence = 40, ActivityTypeName = "Design", IsActiveYn = "Y" },
                new ActivityType { Id = 5, DisplaySequence = 50, ActivityTypeName = "Research", IsActiveYn = "Y" },
                new ActivityType { Id = 6, DisplaySequence = 60, ActivityTypeName = "Meeting", IsActiveYn = "Y" }
            );
            mb.Entity<TaskType>().HasData(
                new TaskType { Id = 1, TaskTypeName = "Task", StaticId = "TASK" },
                new TaskType { Id = 2, TaskTypeName = "Milestone", StaticId = "MILESTONE" },
                new TaskType { Id = 3, TaskTypeName = "Review", StaticId = "REVIEW" }
            );
            mb.Entity<TaskStatus>().HasData(
                new TaskStatus { Id = 1, TaskTypeId = 1, Status = "Open", StaticId = "OPEN", IsDefaultYn = "Y" },
                new TaskStatus { Id = 2, TaskTypeId = 1, Status = "In Progress", StaticId = "IN_PROGRESS" },
                new TaskStatus { Id = 3, TaskTypeId = 1, Status = "Completed", StaticId = "COMPLETED" },
                new TaskStatus { Id = 4, TaskTypeId = 2, Status = "Pending", StaticId = "PENDING", IsDefaultYn = "Y" },
                new TaskStatus { Id = 5, TaskTypeId = 2, Status = "Achieved", StaticId = "ACHIEVED" },
                new TaskStatus { Id = 6, TaskTypeId = 3, Status = "Scheduled", StaticId = "SCHEDULED", IsDefaultYn = "Y" },
                new TaskStatus { Id = 7, TaskTypeId = 3, Status = "Completed", StaticId = "COMPLETED" }
            );
        }

        private static void SeedInitiatives(ModelBuilder mb)
        {
            mb.Entity<Initiative>().HasData(
                new Initiative { Id = 1, AreaId = 1, InitiativeName = "Initiative 1", Objective = "First strategic initiative under Alpha", SponsorId = 1, StatusScale = "A", ArchivedYn = "N", Created = new DateTime(2026, 1, 20), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" },
                new Initiative { Id = 2, AreaId = 1, InitiativeName = "Initiative 2", Objective = "Second strategic initiative under Alpha", SponsorId = 2, StatusScale = "A", ArchivedYn = "N", Created = new DateTime(2026, 1, 20), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" },
                new Initiative { Id = 3, AreaId = 2, InitiativeName = "Initiative 3", Objective = "Strategic initiative under Beta", SponsorId = 3, StatusScale = "A", ArchivedYn = "N", Created = new DateTime(2026, 1, 20), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" }
            );
        }

        private static void SeedReleases(ModelBuilder mb)
        {
            mb.Entity<Release>().HasData(
                new Release { Id = 1, ReleaseTrain = "Alpha", ReleaseName = "R1 1.0", ReleaseTargetDate = new DateTime(2026, 3, 31), ReleaseOpenDate = new DateTime(2026, 1, 1), ReleaseOpenCompleted = "Y", ReleaseCompleted = "N", ReleaseType = "Full", Created = new DateTime(2026, 1, 1), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 15), UpdatedBy = "ADMIN" },
                new Release { Id = 2, ReleaseTrain = "Beta", ReleaseName = "R2 1.0", ReleaseTargetDate = new DateTime(2026, 6, 30), ReleaseOpenDate = new DateTime(2026, 4, 1), ReleaseOpenCompleted = "N", ReleaseCompleted = "N", ReleaseType = "Full", Created = new DateTime(2026, 1, 1), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 15), UpdatedBy = "ADMIN" }
            );
        }

        private static void SeedProjects(ModelBuilder mb)
        {
            // Seed data matching what's in the real APEX Strategic Planner app
            mb.Entity<SpProject>().HasData(
                new SpProject { Id = 1, InitiativeId = 1, ProjectName = "Project 1", OwnerId = 1, ActiveYn = "Y", PriorityId = 2, ReleaseId = 1, PctComplete = 70, StatusId = 1, ProjectSize = "M", StatusScale = "A", RequiresReviewsYn = "N", DocImpactYn = "N", Description = "First project under Initiative 1", Tags = "", TargetComplete = null, Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "john.doe@example.com" },
                new SpProject { Id = 2, InitiativeId = 1, ProjectName = "Jira-1234 We need to fix something", OwnerId = 2, ActiveYn = "Y", PriorityId = 1, ReleaseId = null, PctComplete = 30, StatusId = 1, ProjectSize = "S", StatusScale = "A", RequiresReviewsYn = "N", DocImpactYn = "N", Description = "Urgent fix tracked via Jira", Tags = "urgent", TargetComplete = null, Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "jane.doe@example.com" },
                new SpProject { Id = 3, InitiativeId = 1, ProjectName = "Project 4", OwnerId = 2, ActiveYn = "Y", PriorityId = 4, ReleaseId = null, PctComplete = 20, StatusId = 1, ProjectSize = "XL", StatusScale = "A", RequiresReviewsYn = "N", DocImpactYn = "N", Description = "Fourth project under Initiative 1", Tags = "", TargetComplete = null, Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "jane.doe@example.com" },
                new SpProject { Id = 4, InitiativeId = 3, ProjectName = "Project 5", OwnerId = 2, ActiveYn = "Y", PriorityId = 4, ReleaseId = null, PctComplete = 50, StatusId = 1, ProjectSize = "S", StatusScale = "A", RequiresReviewsYn = "N", DocImpactYn = "N", Description = "Project under Initiative 3 in Beta area", Tags = "", TargetComplete = null, Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "jane.doe@example.com" },
                new SpProject { Id = 5, InitiativeId = 2, ProjectName = "Sales Blitz 1", OwnerId = 3, ActiveYn = "Y", PriorityId = 1, ReleaseId = null, PctComplete = 10, StatusId = 1, ProjectSize = "L", StatusScale = "A", RequiresReviewsYn = "N", DocImpactYn = "N", Description = "First sales blitz campaign", Tags = "", TargetComplete = null, Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "scott.tiger@example.com" },
                new SpProject { Id = 6, InitiativeId = 2, ProjectName = "Sales Blitz 2", OwnerId = 3, ActiveYn = "Y", PriorityId = 5, ReleaseId = null, PctComplete = 20, StatusId = 1, ProjectSize = "M", StatusScale = "A", RequiresReviewsYn = "N", DocImpactYn = "N", Description = "Second sales blitz campaign", Tags = "", TargetComplete = null, Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "scott.tiger@example.com" }
            );
        }

        private static void SeedActivities(ModelBuilder mb)
        {
            mb.Entity<Activity>().HasData(
                new Activity { Id = 1, ActivityTypeId = 1, ProjectId = 1, TeamMemberId = 1, StartDate = new DateTime(2026, 2, 10), EndDate = new DateTime(2026, 2, 14), Comments = "Initial project setup and configuration", Tags = "setup", Created = new DateTime(2026, 2, 10), CreatedBy = "john.doe@example.com", Updated = new DateTime(2026, 2, 14), UpdatedBy = "john.doe@example.com" },
                new Activity { Id = 2, ActivityTypeId = 2, ProjectId = 2, TeamMemberId = 2, StartDate = new DateTime(2026, 2, 15), EndDate = new DateTime(2026, 2, 19), Comments = "Investigating and fixing Jira-1234", Tags = "bugfix", Created = new DateTime(2026, 2, 15), CreatedBy = "jane.doe@example.com", Updated = new DateTime(2026, 2, 19), UpdatedBy = "jane.doe@example.com" },
                new Activity { Id = 3, ActivityTypeId = 1, ProjectId = 5, TeamMemberId = 3, StartDate = new DateTime(2026, 2, 17), EndDate = new DateTime(2026, 2, 21), Comments = "Sales Blitz 1 campaign execution", Tags = "sales", Created = new DateTime(2026, 2, 17), CreatedBy = "scott.tiger@example.com", Updated = new DateTime(2026, 2, 21), UpdatedBy = "scott.tiger@example.com" }
            );
        }

        private static void SeedTasks(ModelBuilder mb)
        {
            mb.Entity<SpTask>().HasData(
                new SpTask { Id = 1, ProjectId = 1, TaskName = "Set up project environment", TaskTypeId = 1, OwnerId = 1, StatusId = 3, StartDate = new DateTime(2026, 2, 1), TargetComplete = new DateTime(2026, 2, 15), Created = new DateTime(2026, 2, 1), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 15), UpdatedBy = "john.doe@example.com" },
                new SpTask { Id = 2, ProjectId = 1, TaskName = "Complete phase 1 deliverables", TaskTypeId = 1, OwnerId = 1, StatusId = 2, StartDate = new DateTime(2026, 2, 10), TargetComplete = new DateTime(2026, 3, 1), Created = new DateTime(2026, 2, 10), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "john.doe@example.com" },
                new SpTask { Id = 3, ProjectId = 2, TaskName = "Reproduce Jira-1234 bug", TaskTypeId = 1, OwnerId = 2, StatusId = 3, StartDate = new DateTime(2026, 2, 15), TargetComplete = new DateTime(2026, 2, 16), Created = new DateTime(2026, 2, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 16), UpdatedBy = "jane.doe@example.com" },
                new SpTask { Id = 4, ProjectId = 2, TaskName = "Deploy fix to production", TaskTypeId = 2, OwnerId = 2, StatusId = 4, TargetComplete = new DateTime(2026, 3, 1), Created = new DateTime(2026, 2, 16), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "ADMIN" },
                new SpTask { Id = 5, ProjectId = 5, TaskName = "Prepare campaign materials", TaskTypeId = 1, OwnerId = 3, StatusId = 2, StartDate = new DateTime(2026, 2, 17), TargetComplete = new DateTime(2026, 2, 28), Created = new DateTime(2026, 2, 17), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "scott.tiger@example.com" },
                new SpTask { Id = 6, ProjectId = 5, TaskName = "Launch blitz event", TaskTypeId = 2, OwnerId = 3, StatusId = 4, TargetComplete = new DateTime(2026, 3, 15), Created = new DateTime(2026, 2, 18), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 18), UpdatedBy = "ADMIN" },
                new SpTask { Id = 7, ProjectId = 6, TaskName = "Sales Blitz 2 planning", TaskTypeId = 1, OwnerId = 3, StatusId = 1, StartDate = new DateTime(2026, 2, 20), TargetComplete = new DateTime(2026, 3, 15), Created = new DateTime(2026, 2, 20), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 20), UpdatedBy = "scott.tiger@example.com" }
            );
        }

        private static void SeedGroups(ModelBuilder mb)
        {
            // Project Groups (SP_PROJECT_GROUPS)
            mb.Entity<ProjectGroup>().HasData(
                new ProjectGroup { Id = 1, GroupName = "Core Platform", Description = "Core platform migration and infrastructure projects", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" },
                new ProjectGroup { Id = 2, GroupName = "Security", Description = "Security-related projects and compliance efforts", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" }
            );

            // People Groups (SP_GROUPS)
            mb.Entity<PeopleGroup>().HasData(
                new PeopleGroup { Id = 1, GroupName = "Platform Team", GroupDescription = "Engineers working on core platform services", GroupTag = "platform", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" },
                new PeopleGroup { Id = 2, GroupName = "Security Council", GroupDescription = "Security review board and compliance team", GroupTag = "security", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 2, 10), UpdatedBy = "ADMIN" }
            );

            // Group Members (SP_GROUP_MEMBERS)
            mb.Entity<GroupMember>().HasData(
                new GroupMember { Id = 1, GroupId = 1, TeamMemberId = 1, GroupLeaderYn = "Y", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" },
                new GroupMember { Id = 2, GroupId = 1, TeamMemberId = 3, GroupLeaderYn = "N", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" },
                new GroupMember { Id = 3, GroupId = 2, TeamMemberId = 2, GroupLeaderYn = "Y", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" },
                new GroupMember { Id = 4, GroupId = 2, TeamMemberId = 1, GroupLeaderYn = "N", Created = new DateTime(2026, 1, 15), CreatedBy = "ADMIN", Updated = new DateTime(2026, 1, 15), UpdatedBy = "ADMIN" }
            );
        }
    }
}
