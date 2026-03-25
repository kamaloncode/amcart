using AmCart.Services.CartAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AmCart.Services.CartAPI.Data
{
    public class CartDbContext : DbContext
    {
        public CartDbContext(DbContextOptions<CartDbContext> options)
            : base(options)
        {
        }

        public DbSet<CartItem> CartItems { get; set; }
    }
}