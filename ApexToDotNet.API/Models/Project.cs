using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    [Table("EBA_DEMO_CAL_PROJECTS")]
    public class Project
    {
        [Key]
        [Column("ID")]
        public decimal Id { get; set; }

        [Column("ROW_VERSION_NUMBER")]
        public decimal? RowVersionNumber { get; set; }

        [Required]
        [Column("PROJECT")]
        [StringLength(30)]
        public string ProjectName { get; set; }

        [Required]
        [Column("TASK_NAME")]
        [StringLength(255)]
        public string TaskName { get; set; }

        [Required]
        [Column("START_DATE")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column("END_DATE")]
        public DateTime EndDate { get; set; }

        [Required]
        [Column("STATUS")]
        [StringLength(30)]
        public string Status { get; set; }

        [Column("ASSIGNED_TO")]
        [StringLength(30)]
        public string AssignedTo { get; set; }

        [Column("COST")]
        public decimal? Cost { get; set; }

        [Column("BUDGET")]
        public decimal? Budget { get; set; }
    }
}
