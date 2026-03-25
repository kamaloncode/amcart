namespace AmCart.Services.CartAPI.Models;

public class CartItem
{
    public int Id { get; set; }

    public string UserId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}