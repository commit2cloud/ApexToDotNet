using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_PROJECTS table - Projects
    /// APEX Pages: 23 (list w/ faceted search), 24 (edit modal), 3 (detail)
    /// </summary>
    [Table("SP_PROJECTS")]
    public class SpProject
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Column("INITIATIVE_ID")]
        public int? InitiativeId { get; set; }

        [Required]
        [Column("PROJECT")]
        [StringLength(1020)]
        public string ProjectName { get; set; } = string.Empty;

        [Column("OWNER_ID")]
        public int? OwnerId { get; set; }

        [Required]
        [Column("ACTIVE_YN")]
        [StringLength(4)]
        public string ActiveYn { get; set; } = "Y";

        [Column("PRIORITY_ID")]
        public int? PriorityId { get; set; }

        [Column("RELEASE_ID")]
        public int? ReleaseId { get; set; }

        [Column("PROJECT_GROUP_ID")]
        public int? ProjectGroupId { get; set; }

        [Column("TARGET_COMPLETE")]
        public DateTime? TargetComplete { get; set; }

        [Column("PCT_COMPLETE")]
        public int? PctComplete { get; set; }

        [Column("STATUS_ID")]
        public int? StatusId { get; set; }

        [Column("PROJECT_SIZE")]
        [StringLength(40)]
        public string? ProjectSize { get; set; }

        [Required]
        [Column("STATUS_SCALE")]
        [StringLength(1)]
        public string StatusScale { get; set; } = "A";

        [Required]
        [Column("REQUIRES_REVIEWS_YN")]
        [StringLength(1)]
        public string RequiresReviewsYn { get; set; } = "N";

        [Required]
        [Column("DOC_IMPACT_YN")]
        [StringLength(4)]
        public string DocImpactYn { get; set; } = "N";

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        [Column("TAGS")]
        public string? Tags { get; set; }

        [Column("FOCUS_AREA_ID")]
        public int? FocusAreaId { get; set; }

        [Column("DISPLAY_EXTERNAL_LINK_YN")]
        [StringLength(4)]
        public string? DisplayExternalLinkYn { get; set; }

        [Column("EXTERNAL_TICKET_IDENTIFIER")]
        [StringLength(512)]
        public string? ExternalTicketIdentifier { get; set; }

        [Column("DUPLICATE_OF_PROJECT_ID")]
        public int? DuplicateOfProjectId { get; set; }

        [Column("ARCHIVED_YN")]
        [StringLength(4)]
        public string? ArchivedYn { get; set; }

        [Column("BLOCKED_BY_YN")]
        [StringLength(4)]
        public string? BlockedByYn { get; set; }

        [Column("BLOCKED_BY_PROJECT_ID")]
        public int? BlockedByProjectId { get; set; }

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
        [ForeignKey("InitiativeId")]
        public Initiative? Initiative { get; set; }

        [ForeignKey("OwnerId")]
        public TeamMember? Owner { get; set; }

        [ForeignKey("ReleaseId")]
        public Release? Release { get; set; }

        [ForeignKey("StatusId")]
        public ProjectStatus? Status { get; set; }

        [ForeignKey("PriorityId")]
        public ProjectPriority? Priority { get; set; }
    }
}
