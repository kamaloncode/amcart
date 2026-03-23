using Microsoft.AspNetCore.Mvc;
using AmCart.Services.CartAPI.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using AmCart.Services.CartAPI.Services;

namespace AmCart.Services.CartAPI.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly RedisCartService _cartService;

    public CartController(RedisCartService cartService)
    {
        _cartService = cartService;
    }
    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
    }

    // GET cart
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var cart = await _cartService.GetCart(userId);

        if (cart != null)
            return Ok(cart);

        return Ok(new Cart { UserId = userId });
    }

    // ADD item
    [HttpPost]
    public async Task<IActionResult> AddToCart(CartItem item)
    {
        var userId = GetUserId();
        var cart = await _cartService.GetCart(userId)
           ?? new Cart { UserId = userId };

        var existing = cart.Items.FirstOrDefault(x => x.ProductId == item.ProductId);

        if (existing != null)
        {
            existing.Quantity += item.Quantity;
            existing.Quantity += item.Quantity;

            if (existing.Quantity <= 0)
            {
                cart.Items.Remove(existing);
            }
        }
        else
        {
            cart.Items.Add(item);
        }

        await _cartService.SaveCart(cart);

        return Ok(cart);
    }

    // REMOVE item
    [HttpDelete("{productId}")]
    public async Task<IActionResult> Remove(int productId)
    {
        var userId = GetUserId();
        var cart = await _cartService.GetCart(userId);

        if (cart == null)
            return NotFound();

        cart.Items.RemoveAll(x => x.ProductId == productId);

        await _cartService.SaveCart(cart);

        return Ok(cart);
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(
    [FromServices] IHttpClientFactory httpClientFactory)
    {
        var userId = GetUserId();

        var cart = await _cartService.GetCart(userId);

        if (cart == null || !cart.Items.Any())
            return BadRequest("Cart is empty");

        var client = httpClientFactory.CreateClient("OrderService");

        var order = new
        {
            items = cart.Items
        };
        client.DefaultRequestHeaders.Authorization =
                                     new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer",
                                        HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "")
                                    );

        var response = await client.PostAsJsonAsync("/api/order", order);

        if (!response.IsSuccessStatusCode)
            return StatusCode(500, "Order creation failed");

        // Clear cart after checkout
        await _cartService.ClearCart(userId);

        var result = await response.Content.ReadFromJsonAsync<object>();

        return Ok(result);
    }
}