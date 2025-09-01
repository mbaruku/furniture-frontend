import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./ManualOrderForm.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManualOrderForm() {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    payment_method: "cash",
    items: [],
    notes: "",
    delivery_option: "",
    delivery_location: "",
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Spinner state

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [godownRes, workshopRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/godown/posted`),
          axios.get(`${API_BASE_URL}/api/workshop/posted`),
        ]);
        const combined = [
          ...godownRes.data.map((p) => ({ ...p, source: "godown" })),
          ...workshopRes.data.map((p) => ({ ...p, source: "workshop" })),
        ];
        setProducts(combined);
      } catch (err) {
        toast.error("Imeshindikana kupakua bidhaa.");
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Add product to selected items
  const handleAddItem = (product) => {
    const uniqueId = `${product.source}-${product.id ?? product.product_name}`;
    if (!selectedItems.find((item) => item.uniqueId === uniqueId)) {
      setSelectedItems([...selectedItems, { ...product, quantity: 1, uniqueId }]);
      toast.success(`${product.product_name} imeongezwa kwenye oda.`);
    }
  };

  // Quantity change
  const handleQuantityChange = (uniqueId, quantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Total calculation
  const calculateTotal = () =>
    selectedItems.reduce((total, item) => total + item.unit_price * item.quantity, 0);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.delivery_option === "yes" && !formData.delivery_location.trim()) {
      toast.warning("Tafadhali weka mahali pa kufikishiwa.");
      return;
    }

    setIsLoading(true);

    const total_price = calculateTotal();
    const items = selectedItems.map((item) => ({
      product_id: item.id ?? null,
      product_name: item.product_name,
      product_type: item.product_type,
      price: item.unit_price,
      quantity: item.quantity,
      source: item.source,
    }));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/manual-order`, {
        customer_name: formData.customer_name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        payment_method: formData.payment_method,
        items,
        notes: formData.notes,
        total_price,
        delivery_option: formData.delivery_option,
        delivery_location: formData.delivery_location,
      });

      toast.success(response.data.message);

      // Reset
      setFormData({
        customer_name: "",
        phone: "",
        email: "",
        location: "",
        payment_method: "cash",
        items: [],
        notes: "",
        delivery_option: "",
        delivery_location: "",
      });
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      toast.error("Hitilafu imetokea, jaribu tena.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="manual-order-container">
      <h2>Fomu ya Oda ya Mkono</h2>
      <form onSubmit={handleSubmit} className="manual-order-form">
        <input
          type="text"
          name="customer_name"
          placeholder="Jina la Mteja"
          required
          onChange={handleChange}
          value={formData.customer_name}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Namba ya Simu"
          required
          onChange={handleChange}
          value={formData.phone}
        />
        <input
          type="email"
          name="email"
          placeholder="Barua Pepe"
          required
          onChange={handleChange}
          value={formData.email}
        />

        <select
          name="delivery_option"
          onChange={handleChange}
          value={formData.delivery_option}
          required
        >
          <option value="">--Chagua Delivery--</option>
          <option value="yes">Ndiyo</option>
          <option value="no">Hapana</option>
        </select>

        {formData.delivery_option === "yes" && (
          <input
            type="text"
            name="delivery_location"
            placeholder="Mahali pa kufikishiwa"
            value={formData.delivery_location}
            onChange={handleChange}
            required
            style={{ marginTop: "8px" }}
          />
        )}

        <select
          name="payment_method"
          onChange={handleChange}
          value={formData.payment_method}
        >
          <option value="cash">Cash</option>
          <option value="mpesa">M-Pesa</option>
          <option value="tigopesa">TigoPesa</option>
          <option value="bank">Benki</option>
        </select>

        <input
          type="text"
          placeholder="Andika jina la bidhaa..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />

        {filteredProducts.length > 0 && (
          <ul className="product-list">
            {filteredProducts.map((product, index) => (
              <li
                key={`${product.source}-${product.id ?? product.product_name}-${index}`}
                onClick={() => handleAddItem(product)}
              >
                {product.product_name} ({product.product_type || "Haijatajwa"}) -{" "}
                {(product.unit_price || 0).toLocaleString()} TZS
              </li>
            ))}
          </ul>
        )}

        {selectedItems.length > 0 && (
          <table className="selected-items-table">
            <thead>
              <tr>
                <th>Bidhaa</th>
                <th>Aina</th>
                <th>Bei</th>
                <th>Idadi</th>
                <th>Jumla</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.uniqueId}>
                  <td>{item.product_name}</td>
                  <td>{item.product_type || "Haijatajwa"}</td>
                  <td>{(item.unit_price || 0).toLocaleString()} TZS</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.uniqueId, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {((item.unit_price || 0) * item.quantity).toLocaleString()} TZS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="total-price">
          Jumla ya Gharama: {(calculateTotal() || 0).toLocaleString()} TZS
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Inatuma..." : "Tuma Order"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}
