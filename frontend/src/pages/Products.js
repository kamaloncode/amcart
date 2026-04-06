import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);
  const [search, setSearch] = useState("");
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || p.category === category),
  );

  let finalProducts = [...filteredProducts];

  if (sort === "low") {
    finalProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    finalProducts.sort((a, b) => b.price - a.price);
  }
  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/product");

      console.log("PRODUCT API:", response.data);

      setProducts(response.data.$values || response.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to cart");
        return;
      }

      await api.post("/api/cart", {
        productId: product.id,
        quantity: 1,
      });

      alert("Added to cart");
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  return (
    <div>
      <Navbar onSearch={setSearch} />

      <h2 style={{ textAlign: "center" }}>Products</h2>
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Price Low to High</option>
        <option value="high">Price High to Low</option>
      </select>

      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.card}>
            <img
              src={
                product.imageUrl
                  ? `https://productservice-hcr6.onrender.com${product.imageUrl}`
                  : "https://via.placeholder.com/150"
              }
              alt={product.name}
              style={styles.image}
            />
            <h3>{product.name}</h3>
            <p>₹ {product.price}</p>
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <h2>Featured Products</h2>
      <div style={styles.grid}>
        {products
          .filter((p) => p.isFeatured)
          .map((p) => (
            <div key={p.id} style={styles.card}>
              {p.name} - ₹{p.price}
            </div>
          ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    padding: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
};

export default Products;
