namespace AmCart.Services.ProductAPI.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsFeatured { get; set; } = false;
    public string ProductImage { get; set; } = string.Empty;
}