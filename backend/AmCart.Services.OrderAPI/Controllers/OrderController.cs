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

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = GetUserId();

        var order = new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        foreach (var item in request.Items)
        {
            item.OrderId = order.Id;
        }

        _db.OrderItems.AddRange(request.Items);
        await _db.SaveChangesAsync();

        order.Items = request.Items;

        return Ok(order);
    }
}