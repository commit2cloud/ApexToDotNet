using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_ACTIVITIES table
    /// APEX Pages: 102 (list), 101/110 (edit modals)
    /// </summary>
    [Table("SP_ACTIVITIES")]
    public class Activity
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Column("ACTIVITY_TYPE_ID")]
        public int? ActivityTypeId { get; set; }

        [Column("PROJECT_ID")]
        public int? ProjectId { get; set; }

        [Column("TEAM_MEMBER_ID")]
        public int? TeamMemberId { get; set; }

        [Column("INITIATIVE_ID")]
        public int? InitiativeId { get; set; }

        [Required]
        [Column("START_DATE")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column("END_DATE")]
        public DateTime EndDate { get; set; }

        [Column("COMMENTS")]
        public string? Comments { get; set; }

        [Column("TICKET_NUMBER")]
        [StringLength(200)]
        public string? TicketNumber { get; set; }

        [Column("URL")]
        [StringLength(2000)]
        public string? Url { get; set; }

        [Column("ACTIVITY_STATUS")]
        [StringLength(120)]
        public string? ActivityStatus { get; set; }

        [Column("TAGS")]
        public string? Tags { get; set; }

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

        [ForeignKey("TeamMemberId")]
        public TeamMember? TeamMember { get; set; }
    }
}
