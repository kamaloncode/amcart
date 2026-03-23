using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class UserRole
    {
        [Key]
        public Guid UserRoleId { get; set; }

        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
    }
}