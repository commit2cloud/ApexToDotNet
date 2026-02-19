namespace ApexToDotNet.API.Models
{
    public class StrategicPlannerModels
    {
        // Enums
        public enum Priority
        {
            P1 = 1,
            P2 = 2,
            P3 = 3,
            P4 = 4,
            P5 = 5
        }

        public enum Size
        {
            XS,
            S,
            M,
            L,
            XL
        }

        // Main Models
        public class Project
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public Priority Priority { get; set; }
            public string? Status { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public int? AreaId { get; set; }
            public string? AreaName { get; set; }
            public int? InitiativeId { get; set; }
            public string? InitiativeName { get; set; }
            public int? PersonCount { get; set; }
            public int? ActivityCount { get; set; }
            public DateTime? CreatedDate { get; set; }
            public DateTime? UpdatedDate { get; set; }
        }

        public class Area
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? Color { get; set; }
            public int? ProjectCount { get; set; }
            public int? InitiativeCount { get; set; }
        }

        public class Initiative
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public Priority Priority { get; set; }
            public Size? Size { get; set; }
            public int? AreaId { get; set; }
            public string? AreaName { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public int? ProjectCount { get; set; }
            public int? ActivityCount { get; set; }
        }

        public class Activity
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string? Description { get; set; }
            public Priority Priority { get; set; }
            public Size? Size { get; set; }
            public string? Status { get; set; }
            public int? ProjectId { get; set; }
            public string? ProjectName { get; set; }
            public int? InitiativeId { get; set; }
            public string? InitiativeName { get; set; }
            public int? AssignedToId { get; set; }
            public string? AssignedToName { get; set; }
            public DateTime? DueDate { get; set; }
            public DateTime? CompletedDate { get; set; }
        }

        public class Person
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Email { get; set; }
            public string? Role { get; set; }
            public string? Department { get; set; }
            public int? ProjectCount { get; set; }
            public int? ActivityCount { get; set; }
            public int? CompletedActivityCount { get; set; }
        }

        public class ProjectGroup
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public int? ProjectCount { get; set; }
        }

        public class PersonGroup
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public int? PersonCount { get; set; }
        }

        public class Release
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public DateTime? ReleaseDate { get; set; }
            public string? Status { get; set; }
            public int? ProjectCount { get; set; }
            public int? ActivityCount { get; set; }
        }

        // Response Models
        public class NavigationCounts
        {
            public int Projects { get; set; }
            public int Areas { get; set; }
            public int Initiatives { get; set; }
            public int Activities { get; set; }
            public int People { get; set; }
            public int ProjectGroups { get; set; }
            public int PersonGroups { get; set; }
            public int Releases { get; set; }
        }

        public class SearchResult<T>
        {
            public List<T> Items { get; set; } = new();
            public int TotalCount { get; set; }
            public int Page { get; set; }
            public int PageSize { get; set; }
        }
    }
}
