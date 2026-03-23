using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class RefreshToken
    {
        [Key]
        public Guid TokenId { get; set; }

        public Guid UserId { get; set; }

        public string Token { get; set; }

        public DateTime ExpiryDate { get; set; }
    }
}