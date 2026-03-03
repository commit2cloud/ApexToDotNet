using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_TEAM_MEMBERS table - People/Users
    /// APEX Pages: 74 (list), 19/20 (detail/edit), 5 (user detail)
    /// </summary>
    [Table("SP_TEAM_MEMBERS")]
    public class TeamMember
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("FIRST_NAME")]
        [StringLength(1020)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [Column("LAST_NAME")]
        [StringLength(1020)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [Column("INITIALS")]
        [StringLength(12)]
        public string Initials { get; set; } = string.Empty;

        [Column("SCREEN_NAME")]
        [StringLength(200)]
        public string? ScreenName { get; set; }

        [Required]
        [Column("EMAIL")]
        [StringLength(1020)]
        public string Email { get; set; } = string.Empty;

        [Column("EMAIL_DOMAIN")]
        [StringLength(1020)]
        public string? EmailDomain { get; set; }

        [Column("TAGS")]
        public string? Tags { get; set; }

        [Column("IS_CURRENT_YN")]
        [StringLength(4)]
        public string? IsCurrentYn { get; set; }

        [Column("LOCATION")]
        [StringLength(2000)]
        public string? Location { get; set; }

        [Column("COUNTRY_ID")]
        public int? CountryId { get; set; }

        [Column("APP_ROLE")]
        [StringLength(1020)]
        public string? AppRole { get; set; }

        [Column("COMPETENCIES")]
        public string? Competencies { get; set; }

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

        // Computed
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
    }
}
