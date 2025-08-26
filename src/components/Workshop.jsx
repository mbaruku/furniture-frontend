import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Workshop.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Workshop() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    price: "",
    image_url: ""
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/workshop`);
      // Hakikisha data ni array
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/workshop`, formData);
      setFormData({ name: "", type: "", quantity: "", price: "", image_url: "" });
      fetchItems();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  return (
    <div className="workshop-container">
      <h2>Workshop Items</h2>

      {/* Form ya kuongeza bidhaa mpya */}
      <form className="add-item-form" onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Jina la Bidhaa"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Aina"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Kiasi"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Bei"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
        <button type="submit">Ongeza Bidhaa</button>
      </form>

      {/* Tabeli ya bidhaa zilizopo */}
      <table>
        <thead>
          <tr>
            <th>Picha</th>
            <th>Jina</th>
            <th>Aina</th>
            <th>Kiasi</th>
            <th>Bei</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td><img src={item.image_url} alt={item.name} /></td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
