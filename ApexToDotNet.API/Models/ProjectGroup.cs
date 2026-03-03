using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_PROJECT_GROUPS table
    /// APEX Pages: 70 (list), 90 (edit modal)
    /// </summary>
    [Table("SP_PROJECT_GROUPS")]
    public class ProjectGroup
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("GROUP_NAME")]
        [StringLength(200)]
        public string GroupName { get; set; } = string.Empty;

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

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
