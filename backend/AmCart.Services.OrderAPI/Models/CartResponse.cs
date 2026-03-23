using AmCart.Services.OrderAPI.Models;

public class CartResponse
{
    public string UserId { get; set; }
    public List<OrderItem> Items { get; set; }
}