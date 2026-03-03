using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_RELEASE_TRAINS table - Releases
    /// APEX Pages: 8 (list), 27 (edit modal), 117 (detail), 202 (dashboard), 203 (calendar)
    /// </summary>
    [Table("SP_RELEASE_TRAINS")]
    public class Release
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("RELEASE_TRAIN")]
        [StringLength(200)]
        public string ReleaseTrain { get; set; } = string.Empty;

        [Column("RELEASE_OWNER_ID")]
        public int? ReleaseOwnerId { get; set; }

        [Required]
        [Column("RELEASE")]
        [StringLength(120)]
        public string ReleaseName { get; set; } = string.Empty;

        [Column("RELEASE_TARGET_DATE")]
        public DateTime? ReleaseTargetDate { get; set; }

        [Column("RELEASE_OPEN_DATE")]
        public DateTime? ReleaseOpenDate { get; set; }

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        [Required]
        [Column("RELEASE_OPEN_COMPLETED")]
        [StringLength(4)]
        public string ReleaseOpenCompleted { get; set; } = "N";

        [Required]
        [Column("RELEASE_COMPLETED")]
        [StringLength(4)]
        public string ReleaseCompleted { get; set; } = "N";

        [Column("RELEASE_TYPE")]
        [StringLength(200)]
        public string? ReleaseType { get; set; }

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
        [ForeignKey("ReleaseOwnerId")]
        public TeamMember? Owner { get; set; }
    }
}
