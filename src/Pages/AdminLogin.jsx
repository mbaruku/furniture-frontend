import { useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import './AdminLogin.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admins/login`, {
        username,
        password,
      });
      setIsSuperAdmin(res.data.is_superadmin);
    } catch (err) {
      alert("Login failed: " + err.response?.data?.error);
    }
  };

  if (isSuperAdmin !== null) {
    return <AdminDashboard isSuperAdmin={isSuperAdmin} />;
  }

  return (
    <div className="login-form">
      <div className="login-form-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}
