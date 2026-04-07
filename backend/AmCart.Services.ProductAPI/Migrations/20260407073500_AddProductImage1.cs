using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmCart.Services.ProductAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductImage1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Products",
                newName: "ProductImage");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProductImage",
                table: "Products",
                newName: "ImageUrl");
        }
    }
}
