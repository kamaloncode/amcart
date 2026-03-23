using Microsoft.AspNetCore.Mvc;
using AmCart.Services.ProductAPI.Data;
using AmCart.Services.ProductAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AmCart.Services.ProductAPI.Controllers;

[ApiController]
[Route("api/product")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ProductsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _db.Products.ToListAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Product updatedProduct)
    {
        if (updatedProduct == null) return BadRequest();

        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = updatedProduct.Name;
        product.Price = updatedProduct.Price;
        product.Category = updatedProduct.Category;
        product.IsFeatured = updatedProduct.IsFeatured;

        await _db.SaveChangesAsync();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();

        return Ok();
    }
}