using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AmCart.Services.OrderAPI.Models;
using AmCart.Services.OrderAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AmCart.Services.OrderAPI.Controllers;

[ApiController]
[Route("api/order")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly OrderDbContext _db;

    public OrderController(OrderDbContext db)
    {
        _db = db;
    }

    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    }

    //  GET orders
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetUserId();

        var orders = await _db.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .ToListAsync();

        return Ok(orders);
    }

    // CREATE order (from Cart)
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] dynamic data)
    {
        var userId = GetUserId();

        var items = ((IEnumerable<dynamic>)data.items)
            .Select(i => new OrderItem
            {
                ProductId = (int)i.productId,
                ProductName = i.productName != null ? (string)i.productName : "",
                Quantity = (int)i.quantity,
                Price = i.price != null ? (decimal)i.price : 0
            }).ToList();

        var order = new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();   // get Order.Id

        foreach (var item in items)
        {
            item.OrderId = order.Id;
        }

        order.Items = items;

        _db.OrderItems.AddRange(items);
        await _db.SaveChangesAsync();

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return Ok(order);
    }
}