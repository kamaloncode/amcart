using Microsoft.EntityFrameworkCore;
using AmCart.Services.OrderAPI.Models;
using System.Collections.Generic;

namespace AmCart.Services.OrderAPI.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
    }
}