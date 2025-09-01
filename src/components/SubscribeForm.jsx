import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./SubscribeForm.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.warning("Tafadhali weka email sahihi.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/subscribe`, { email });
      toast.success("✅ Umefanikiwa kujiunga kupokea matangazo.");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Email hii tayari imesha jiunga au hitilafu imejitokeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-container">
      <input
        type="email"
        placeholder="Weka Email yako"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Inajiunga..." : "Jiunge Kupokea Matangazo"}
      </button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}
