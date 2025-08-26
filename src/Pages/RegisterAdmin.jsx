import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminRegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_superadmin: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admins/register`, formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error registering admin");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register Admin</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="is_superadmin"
            checked={formData.is_superadmin}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Super Admin (Admin Mkuu)
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
