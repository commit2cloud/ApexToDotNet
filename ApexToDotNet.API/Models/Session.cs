using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    [Table("EBA_DEMO_CAL_SESSIONS")]
    public class Session
    {
        [Key]
        [Column("ID")]
        public decimal Id { get; set; }

        [Column("ROW_VERSION_NUMBER")]
        public decimal? RowVersionNumber { get; set; }

        [Required]
        [Column("TITLE")]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        [Column("SESSION_TYPE")]
        [StringLength(30)]
        public string SessionType { get; set; }

        [Column("SPEAKER")]
        [StringLength(255)]
        public string Speaker { get; set; }

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
    }
}
