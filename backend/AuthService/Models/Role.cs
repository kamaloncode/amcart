using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class Role
    {
        [Key]
        public Guid RoleId { get; set; }

        public string RoleName { get; set; }
    }
}