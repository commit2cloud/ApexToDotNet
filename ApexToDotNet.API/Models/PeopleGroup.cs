using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApexToDotNet.API.Models
{
    /// <summary>
    /// Maps to SP_GROUPS table - People Groups
    /// APEX Pages: 103 (list), 150 (edit modal), 151 (members)
    /// </summary>
    [Table("SP_GROUPS")]
    public class PeopleGroup
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("GROUP_NAME")]
        [StringLength(200)]
        public string GroupName { get; set; } = string.Empty;

        [Column("GROUP_DESCRIPTION")]
        public string? GroupDescription { get; set; }

        [Column("GROUP_TAG")]
        [StringLength(200)]
        public string? GroupTag { get; set; }

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

    /// <summary>
    /// Maps to SP_GROUP_MEMBERS table
    /// APEX Pages: 151 (list), 152 (edit modal)
    /// </summary>
    [Table("SP_GROUP_MEMBERS")]
    public class GroupMember
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Column("GROUP_ID")]
        public int GroupId { get; set; }

        [ForeignKey("GroupId")]
        public PeopleGroup? Group { get; set; }

        [Column("TEAM_MEMBER_ID")]
        public int TeamMemberId { get; set; }

        [ForeignKey("TeamMemberId")]
        public TeamMember? TeamMember { get; set; }

        [Column("GROUP_LEADER_YN")]
        [StringLength(4)]
        public string? GroupLeaderYn { get; set; }

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
