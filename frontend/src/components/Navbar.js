import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) onSearch(value);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.nav}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/products")}>
        AmCart
      </h2>
      <h4>Deployment ID: dcac6136-a03e-4504-800b-99709d28b2cad </h4>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      <div>
        <button onClick={() => navigate("/products")}>Products</button>
        <button onClick={() => navigate("/cart")}>Cart</button>
        <button onClick={() => navigate("/orders")}>Orders</button>
        <button onClick={() => navigate("/checkout")}>Checkout</button>
        <button onClick={() => navigate("/admin")}>Admin</button>
        <button onClick={() => navigate("/privacy")}>Privacy</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white",
  },
  search: {
    padding: "5px",
    width: "300px",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
  },
};

export default Navbar;
