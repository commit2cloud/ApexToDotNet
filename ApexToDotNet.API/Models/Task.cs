using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    [Table("TASKS")]
    public class Task
    {
        [Key]
        [Column("TASK_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public decimal TaskId { get; set; }

        [Required]
        [Column("TASK_TITLE")]
        [StringLength(200)]
        public string TaskTitle { get; set; }

        [Column("TASK_DESCRIPTION")]
        [StringLength(4000)]
        public string TaskDescription { get; set; }

        [Required]
        [Column("STATUS")]
        [StringLength(20)]
        public string Status { get; set; }

        [Column("PRIORITY")]
        [StringLength(20)]
        public string Priority { get; set; }

        [Column("DUE_DATE")]
        public DateTime? DueDate { get; set; }

        [Required]
        [Column("CREATED_DATE")]
        public DateTime CreatedDate { get; set; }
    }
}
