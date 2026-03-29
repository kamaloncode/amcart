import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/order");

      const data = res.data?.$values || res.data || [];

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const getTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found</p>
      ) : (
        <div style={{ padding: "20px" }}>
          {orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <h3>Order #{order.id}</h3>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

              <div>
                <strong>Items:</strong>
                {order.items.length === 0 ? (
                  <p>No items</p>
                ) : (
                  order.items.map((item, index) => (
                    <div key={index}>
                      {item.productName} x {item.quantity} (₹ {item.price})
                    </div>
                  ))
                )}
              </div>

              <h4>Total: ₹ {getTotal(order.items)}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
  },
};

export default Orders;
