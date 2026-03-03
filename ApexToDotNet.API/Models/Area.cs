using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_AREAS table - Focus Areas (top-level grouping)
    /// APEX Pages: 17 (list), 18 (edit modal)
    /// </summary>
    [Table("SP_AREAS")]
    public class Area
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("AREA")]
        [StringLength(200)]
        public string AreaName { get; set; } = string.Empty;

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        [Column("OWNER_ID")]
        public int? OwnerId { get; set; }

        [Column("STATUS_SCALE")]
        [StringLength(1)]
        public string? StatusScale { get; set; }

        [Column("HIDDEN_BY_DEFAULT_YN")]
        [StringLength(4)]
        public string? HiddenByDefaultYn { get; set; }

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
    }
}
