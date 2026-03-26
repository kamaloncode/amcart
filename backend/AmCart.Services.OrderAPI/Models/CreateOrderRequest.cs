namespace AmCart.Services.OrderAPI.Models
{
    public class CreateOrderRequest
    {
        public List<OrderItem> Items { get; set; }
    }
}