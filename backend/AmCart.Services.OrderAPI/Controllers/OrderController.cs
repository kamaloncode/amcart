using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AmCart.Services.OrderAPI.Models;

namespace AmCart.Services.OrderAPI.Controllers;

[ApiController]
[Route("api/order")]
[Authorize]
public class OrderController : ControllerBase
{
    private static readonly List<Order> _orders = new();

    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    }

    // GET all orders for user
    [HttpGet]
    public IActionResult GetOrders()
    {
        var userId = GetUserId();

        var userOrders = _orders.Where(o => o.UserId == userId).ToList();

        return Ok(userOrders);
    }

    // CREATE order (checkout)
    [HttpPost]
    public IActionResult CreateOrder([FromBody] dynamic data)
    {
        var userId = GetUserId();

        var items = ((IEnumerable<dynamic>)data.items)
            .Select(i => new OrderItem
            {
                ProductId = (int)i.productId,
                ProductName = (string)i.productName,
                Quantity = (int)i.quantity,
                Price = (decimal)i.price
            }).ToList();

        var order = new Order
        {
            Id = _orders.Count + 1,
            UserId = userId,
            Items = items,
            CreatedAt = DateTime.UtcNow
        };

        _orders.Add(order);

        return Ok(order);
    }
}