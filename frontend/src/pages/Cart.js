import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    fetchCart();
  }, []);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }
  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart");

      const data = res.data?.$values || res.data?.items || res.data;

      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/api/cart/${productId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  const updateQuantity = async (item, change) => {
    try {
      await api.post("/api/cart", {
        productId: item.productId,
        quantity: change,
      });

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>My Cart</h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Cart is empty</p>
      ) : (
        <div style={{ padding: "20px" }}>
          {cartItems.map((item) => (
            <div key={item.productId} style={styles.card}>
              <h3>{item.productName}</h3>
              <p>₹ {item.price}</p>

              <div>
                <button onClick={() => updateQuantity(item, -1)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item, 1)}>+</button>
              </div>

              <button onClick={() => removeItem(item.productId)}>Remove</button>
            </div>
          ))}
          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
          <h2>Total: ₹ {total}</h2>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};

export default Cart;
