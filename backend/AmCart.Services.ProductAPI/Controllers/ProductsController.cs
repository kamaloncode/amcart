using Microsoft.AspNetCore.Mvc;
using AmCart.Services.ProductAPI.Data;
using AmCart.Services.ProductAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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
        try
        {
            var products = await _db.Products.ToListAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [Authorize(Roles = "Admin")]    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
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

    [HttpGet("by-category/{category}")]
    public async Task<IActionResult> GetByCategory(string category)
    {
        var products = await _db.Products
            .Where(p => p.Category == category)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }
}