using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_TASKS table - Tasks within Projects
    /// APEX Pages: 501 (edit modal), 502 (detail)
    /// </summary>
    [Table("SP_TASKS")]
    public class SpTask
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("PROJECT_ID")]
        public int ProjectId { get; set; }

        [Column("TASK")]
        [StringLength(1020)]
        public string? TaskName { get; set; }

        [Required]
        [Column("TASK_TYPE_ID")]
        public int TaskTypeId { get; set; }

        [Column("TASK_SUB_TYPE_ID")]
        public int? TaskSubTypeId { get; set; }

        [Column("OWNER_ID")]
        public int? OwnerId { get; set; }

        [Column("START_DATE")]
        public DateTime? StartDate { get; set; }

        [Column("TARGET_COMPLETE")]
        public DateTime? TargetComplete { get; set; }

        [Required]
        [Column("STATUS_ID")]
        public int StatusId { get; set; }

        [Column("STATUS_LAST_CHANGED_ON")]
        public DateTime? StatusLastChangedOn { get; set; }

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        [Column("TAGS")]
        public string? Tags { get; set; }

        [Column("IMPACT")]
        [StringLength(120)]
        public string? Impact { get; set; }

        [Column("CREATED")]
        public DateTime Created { get; set; }

        [Column("CREATED_BY")]
        [StringLength(1020)]
        public string CreatedBy { get; set; } = string.Empty;

        [Column("UPDATED")]
        public DateTime Updated { get; set; }

        [Column("UPDATED_BY")]
        [StringLength(1020)]
        public string UpdatedBy { get; set; } = string.Empty;

        // Navigation
        [ForeignKey("ProjectId")]
        public SpProject? Project { get; set; }

        [ForeignKey("OwnerId")]
        public TeamMember? Owner { get; set; }
    }
}
