import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./CustomerForm.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CustomerForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.warning("Tafadhali jaza sehemu zote muhimu.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/contact`, form);
      toast.success("✅ Ujumbe umetumwa kwa Admin.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Kuna shida kutuma ujumbe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-container">
      <h2>Wasiliana Nasi</h2>
      <input
        type="text"
        placeholder="Jina lako"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email yako"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Kichwa cha Ujumbe (optional)"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />
      <textarea
        placeholder="Ujumbe wako..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Inatuma..." : "Tuma Ujumbe"}
      </button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}
