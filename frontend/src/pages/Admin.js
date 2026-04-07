import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../index.css";
import api from "../services/api";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    price: "",
    category: "",
    isFeatured: false,
    image: null,
  });

  const token = localStorage.getItem("token");

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/product");

      setProducts(res.data?.$values || res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // Generic input handler for text/number/checkbox
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveProduct = async () => {
    try {
      let base64Image = null;

      if (form.image) {
        base64Image = await toBase64(form.image);
      }

      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        isFeatured: form.isFeatured,
        productImage: base64Image,
      };

      await api.post("/api/product", payload);

      setForm({
        id: 0,
        name: "",
        price: "",
        category: "",
        isFeatured: false,
        image: null,
      });

      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const editProduct = (product) => {
    setForm({
      id: product.id || 0,
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      isFeatured: product.isFeatured || false,
    });
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>Admin Panel</h2>

      {/* FORM */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />{" "}
          Featured
        </label>
        <button onClick={saveProduct} style={{ marginLeft: "10px" }}>
          {form.id === 0 ? "Add Product" : "Update Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div style={{ padding: "20px" }}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <img
              src={`https://productservice-hcr6.onrender.com${p.imageUrl}`}
              alt={p.name}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>
            <p>Category: {p.category}</p>
            <p>Featured: {p.isFeatured ? "Yes" : "No"}</p>
            <button onClick={() => editProduct(p)}>Edit</button>
            <button
              onClick={() => deleteProduct(p.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};

export default Admin;
