using StackExchange.Redis;
using System.Text.Json;
using AmCart.Services.CartAPI.Models;

namespace AmCart.Services.CartAPI.Services;

public class RedisCartService
{
    private readonly IDatabase _db;

    public RedisCartService(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task<Cart?> GetCart(string userId)
    {
        var data = await _db.StringGetAsync(userId);

        if (data.IsNullOrEmpty)
            return null;

        return JsonSerializer.Deserialize<Cart>(data);
    }

    public async Task SaveCart(Cart cart)
    {
        await _db.StringSetAsync(
            cart.UserId,
            JsonSerializer.Serialize(cart));
    }
    public async Task ClearCart(string userId)
    {
        await _db.KeyDeleteAsync(userId);
    }
}