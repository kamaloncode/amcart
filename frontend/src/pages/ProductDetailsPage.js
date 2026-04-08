import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/api/product/by-category/${category}`);
      const data = res.data.$values || res.data || [];

      setProducts(data);

      const index = data.findIndex((p) => p.id == id);
      setCurrentIndex(index);
    } catch (err) {
      console.error(err);
    }
  };

  const product = products[currentIndex];

  if (!product) return <div>Loading...</div>;

  // Add to cart (your existing logic)
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login");
        return;
      }

      await api.post("/api/cart", {
        productId: product.id,
        quantity: qty,
      });

      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  //  Navigation
  const next = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      <Navbar />

      <button onClick={() => navigate(-1)}>← Back to Catalog</button>

      <div style={styles.container}>
        {/* LEFT - IMAGE */}
        <div>
          <img
            src={product.productImage || "https://via.placeholder.com/300"}
            alt={product.name}
            style={styles.image}
          />
        </div>

        {/* RIGHT - DETAILS */}
        <div style={styles.info}>
          <h2>{product.name}</h2>

          <p>{product.description}</p>

          <h3>₹ {product.price}</h3>

          <p>{product.isFeatured ? " Featured Product" : ""}</p>

          {/* Quantity */}
          <div style={styles.qty}>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <input value={qty} readOnly style={styles.qtyInput} />
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          {/* Actions */}
          <button onClick={addToCart}>Add to Cart</button>

          <button
            onClick={() =>
              navigator.share?.({
                title: product.name,
                url: window.location.href,
              }) || alert("Sharing not supported")
            }
          >
            Share
          </button>

          <button onClick={() => window.print()}>Print</button>

          {/* Prev / Next */}
          <div style={styles.nav}>
            <button onClick={prev}>◀</button>
            <button onClick={next}>▶</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "40px",
    padding: "20px",
  },
  image: {
    width: "300px",
    borderRadius: "10px",
  },
  info: {
    maxWidth: "400px",
  },
  qty: {
    display: "flex",
    gap: "10px",
    margin: "10px 0",
  },
  qtyInput: {
    width: "40px",
    textAlign: "center",
  },
  nav: {
    marginTop: "20px",
  },
};

export default ProductDetailsPage;
