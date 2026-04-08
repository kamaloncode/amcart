import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Checkout = () => {
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
      const response = await api.get("/api/cart");

      console.log("CART API:", response.data);

      const data =
        response.data?.$values || response.data?.items || response.data;

      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const placeOrder = async () => {
    try {
      await api.post("/api/cart/checkout");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>Checkout</h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Cart is empty</p>
      ) : (
        <div style={{ textAlign: "center" }}>
          <table border="1">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName || item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: {getTotal()}</h3>
          <h3>Total Amount: ₹ {total}</h3>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
