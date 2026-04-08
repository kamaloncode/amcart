import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/product");
      setProducts(response.data.$values || response.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const openProduct = (product) => {
    navigate(`/product/${product.id}?category=${product.category}`);
  };

  const addToCart = async (product, e) => {
    e.stopPropagation();

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

  // Filtering
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || p.category === category),
  );

  // Sorting
  let finalProducts = [...filteredProducts];

  if (sort === "low") {
    finalProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    finalProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div>
      <Navbar onSearch={setSearch} />

      <h2 style={{ textAlign: "center" }}>Products</h2>

      {/* Move category filter OUTSIDE */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Price Low to High</option>
          <option value="high">Price High to Low</option>
        </select>
      </div>

      <div style={styles.grid}>
        {finalProducts.map((product) => (
          <div
            key={product.id}
            style={styles.card}
            onClick={() => openProduct(product)}
          >
            <img
              src={product.productImage || "https://via.placeholder.com/150"}
              alt={product.name}
              style={styles.image}
            />
            <h3>{product.name}</h3>
            <p>₹ {product.price}</p>

            <button onClick={(e) => addToCart(product, e)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Featured */}
      <h2 style={{ textAlign: "center" }}>Featured Products</h2>
      <div style={styles.grid}>
        {products
          .filter((p) => p.isFeatured)
          .map((p) => (
            <div key={p.id} style={styles.card}>
              <img
                src={p.productImage || "https://via.placeholder.com/150"}
                alt={p.name}
                style={styles.image}
              />
              <h4>{p.name}</h4>
              <p>₹ {p.price}</p>
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
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
};

export default Products;
