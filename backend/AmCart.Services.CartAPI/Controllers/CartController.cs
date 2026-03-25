using Microsoft.AspNetCore.Mvc;
using AmCart.Services.CartAPI.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using AmCart.Services.CartAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AmCart.Services.CartAPI.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly CartDbContext _db;

    public CartController(CartDbContext db)
    {
        _db = db;
    }

    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
    }

    //  GET cart for logged-in user
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();

        var items = await _db.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return Ok(items);
    }

    // ADD item to cart
    [HttpPost]
    public async Task<IActionResult> AddToCart(CartItem item)
    {
        var userId = GetUserId();   // GET USER

        var existing = await _db.CartItems
            .FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == item.ProductId);

        if (existing != null)
        {
            existing.Quantity += item.Quantity;

            if (existing.Quantity <= 0)
            {
                _db.CartItems.Remove(existing);
            }
        }
        else
        {
            item.UserId = userId;   
            _db.CartItems.Add(item);
        }

        await _db.SaveChangesAsync();

        return Ok(await _db.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync());
    }

    // REMOVE item
    [HttpDelete("{productId}")]
    public async Task<IActionResult> Remove(int productId)
    {
        var userId = GetUserId();

        var item = await _db.CartItems
            .FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == productId);

        if (item == null)
            return NotFound();

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(
        [FromServices] IHttpClientFactory httpClientFactory)
    {
        var userId = GetUserId();

        var items = await _db.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

        if (!items.Any())
            return BadRequest("Cart is empty");

        var client = httpClientFactory.CreateClient("OrderService");

        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer",
                HttpContext.Request.Headers["Authorization"]
                    .ToString().Replace("Bearer ", "")
            );

        var response = await client.PostAsJsonAsync("/api/order", new { items });

        if (!response.IsSuccessStatusCode)
            return StatusCode(500, "Order creation failed");

        //  Clear cart
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();

        var result = await response.Content.ReadFromJsonAsync<object>();

        return Ok(result);
    }
}