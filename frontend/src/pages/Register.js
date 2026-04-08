import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    try {
      await api.post("/api/auth/register", form);

      alert("Registration successful");
      navigate("/");
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>

      <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
      />
      <br />
      <br />

      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <br />
      <br />

      <input
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleChange}
      />
      <br />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br />
      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br />
      <br />

      <button onClick={register}>Register</button>
    </div>
  );
};

export default Register;
