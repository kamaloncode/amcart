import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Checkout from "../pages/Checkout";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import Privacy from "../pages/Privacy";
import Contact from "../pages/Contact";
import ProductDetailsPage from "../pages/ProductDetailsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
