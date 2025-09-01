import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './RegisterEmployees.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterEmployee() {
  const [form, setForm] = useState({
    name: "", gender: "", phone: "", position: "", salary: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    axios.post(`${API_BASE_URL}/api/employees`, form)
      .then(() => {
        toast.success("✅ Mfanyakazi ameongezwa");
        setForm({ name: "", gender: "", phone: "", position: "", salary: "" });
      })
      .catch(err => {
        console.error(err);
        toast.error("❌ Hitilafu wakati wa kuongeza mfanyakazi.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded space-y-3">
        <h2 className="font-bold text-lg mb-2">Sajili Mfanyakazi</h2>
        <input type="text" placeholder="Jina" required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <select required className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="">Chagua Jinsia</option>
          <option value="Mwanaume">Mwanaume</option>
          <option value="Mwanamke">Mwanamke</option>
        </select>
        <input type="text" placeholder="Namba ya Simu" required className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input type="text" placeholder="Cheo/Kazi" required className="input" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        <input type="number" placeholder="Mshahara" required className="input" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
        <button type="submit" className="btn bg-green-600 text-white rounded" disabled={loading}>
          {loading ? "Inasajili..." : "Sajili"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}
