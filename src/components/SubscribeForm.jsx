import { useState } from "react";
import axios from "axios";
import "./SubscribeForm.css"; // 👈 Hakikisha umeimport CSS

 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
export default function SubscribeForm() {
  const [email, setEmail] = useState("");

 

  const handleSubscribe = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/subscribe`, { email });
      alert("Umefanikiwa kujiunga kupokea matangazo.");
      setEmail(""); // Clear input
    } catch (err) {
      alert("Email hii tayari imesha jiunga.");
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
      <button onClick={handleSubscribe}>Jiunge Kupokea Matangazo</button>
    </div>
  );
}

