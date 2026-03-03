using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_INITIATIVES table - Strategic Initiatives
    /// APEX Pages: 21 (list), 22 (edit modal), 94 (detail)
    /// </summary>
    [Table("SP_INITIATIVES")]
    public class Initiative
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("AREA_ID")]
        public int AreaId { get; set; }

        [Required]
        [Column("INITIATIVE")]
        [StringLength(1020)]
        public string InitiativeName { get; set; } = string.Empty;

        [Column("OBJECTIVE")]
        public string? Objective { get; set; }

        [Column("SPONSOR_ID")]
        public int? SponsorId { get; set; }

        [Column("FRIENDLY_IDENTIFIER")]
        [StringLength(30)]
        public string? FriendlyIdentifier { get; set; }

        [Column("STATUS_SCALE")]
        [StringLength(1)]
        public string? StatusScale { get; set; }

        [Column("TAGS")]
        public string? Tags { get; set; }

        [Column("HIDDEN_BY_DEFAULT_YN")]
        [StringLength(4)]
        public string? HiddenByDefaultYn { get; set; }

        [Column("ARCHIVED_YN")]
        [StringLength(4)]
        public string? ArchivedYn { get; set; }

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
        [ForeignKey("AreaId")]
        public Area? Area { get; set; }

        [ForeignKey("SponsorId")]
        public TeamMember? Sponsor { get; set; }
    }
}
