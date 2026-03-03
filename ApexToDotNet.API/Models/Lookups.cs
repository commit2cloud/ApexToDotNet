using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    [Table("SP_PROJECT_STATUSES")]
    public class ProjectStatus
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("STATUS")]
        [StringLength(400)]
        public string Status { get; set; } = string.Empty;

        [Required]
        [Column("STATIC_ID")]
        [StringLength(120)]
        public string StaticId { get; set; } = string.Empty;

        [Column("DISPLAY_SEQ")]
        public int? DisplaySeq { get; set; }

        [Required]
        [Column("INCLUDE_YN")]
        [StringLength(4)]
        public string IncludeYn { get; set; } = "Y";
    }

    [Table("SP_PROJECT_PRIORITIES")]
    public class ProjectPriority
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("PRIORITY")]
        public int Priority { get; set; }

        [Required]
        [Column("DESCRIPTION")]
        [StringLength(160)]
        public string Description { get; set; } = string.Empty;

        [Column("IS_DEFAULT_YN")]
        [StringLength(4)]
        public string? IsDefaultYn { get; set; }
    }

    [Table("SP_ACTIVITY_TYPES")]
    public class ActivityType
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("DISPLAY_SEQUENCE")]
        public int DisplaySequence { get; set; }

        [Required]
        [Column("ACTIVITY_TYPE")]
        [StringLength(200)]
        public string ActivityTypeName { get; set; } = string.Empty;

        [Column("ACTIVITY_TYPE_DESCRIPTION")]
        public string? Description { get; set; }

        [Column("IS_ACTIVE_YN")]
        [StringLength(4)]
        public string? IsActiveYn { get; set; }
    }

    [Table("SP_TASK_TYPES")]
    public class TaskType
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("TASK_TYPE")]
        [StringLength(200)]
        public string TaskTypeName { get; set; } = string.Empty;

        [Column("STATIC_ID")]
        [StringLength(120)]
        public string? StaticId { get; set; }
    }

    [Table("SP_TASK_STATUSES")]
    public class TaskStatus
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("TASK_TYPE_ID")]
        public int TaskTypeId { get; set; }

        [Required]
        [Column("STATUS")]
        [StringLength(200)]
        public string Status { get; set; } = string.Empty;

        [Column("STATIC_ID")]
        [StringLength(120)]
        public string? StaticId { get; set; }

        [Column("IS_DEFAULT_YN")]
        [StringLength(4)]
        public string? IsDefaultYn { get; set; }
    }

    [Table("SP_RELEASE_MILESTONE_TYPES")]
    public class ReleaseMilestoneType
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("MILESTONE_TYPE")]
        [StringLength(200)]
        public string MilestoneTypeName { get; set; } = string.Empty;
    }
}
