import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrency } from "../../utiis/helpers";
import TopNavbar from "../../components/NavMenu";
import BottomNavbar from "../../components/BottomNavbar";
import { useCart } from "../../context/CartContext";
import PostedProductCard from "../../components/PostedProductCard";
import "./PostedProductsPage.css";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostedProductsPage() {
  const [postedItems, setPostedItems] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [customerLocation, setCustomerLocation] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");

  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    showModal,
    setShowModal,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    const fetchPostedItems = async () => {
      try {
        const [godownRes, workshopRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/godown/posted`),
          axios.get(`${API_BASE_URL}/api/workshop/posted`),
        ]);

        const combinedItems = [
          ...godownRes.data.map((p) => ({ ...p, source: "godown" })),
          ...workshopRes.data.map((p) => ({ ...p, source: "workshop" })),
        ];
        setPostedItems(combinedItems);
      } catch (err) {
        console.error("Failed to fetch posted items", err);
        toast.error("⚠️ Imeshindikana kupata bidhaa zilizopostiwa", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    fetchPostedItems();
  }, []);

  const filteredItems =
    filterType === "all"
      ? postedItems
      : postedItems.filter((item) => item.product_type === filterType);

  const uniqueTypes = Array.from(
    new Set(postedItems.map((item) => item.product_type))
  ).sort();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.warning("🛒 Kikapu kiko tupu, tafadhali ongeza bidhaa kwanza!", {
        position: "top-center",
      });
      return;
    }

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !customerLocation
    ) {
      toast.warning("⚠️ Tafadhali jaza taarifa zote za mteja", {
        position: "top-center",
      });
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      location: customerLocation,
      delivery_option: deliveryOption || "no",
      order_items: cartItems.map((item) => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        source: item.source,
      })),
      total_price: totalPrice,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status >= 200 && res.status < 300) {
        toast.success("✅ Oda imetumwa kikamilifu!", {
          position: "top-center",
          autoClose: 3000,
        });

        clearCart();
        setShowModal(false);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setCustomerLocation("");
        setDeliveryOption("");
      } else {
        toast.error(
          `⚠️ ${res.data.error || "Tatizo limejitokeza kwenye kutuma oda."}`,
          { position: "top-center" }
        );
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message || err);
      const msg =
        err.response?.data?.error || "Tatizo limejitokeza kwenye kutuma oda.";
      toast.error(`⚠️ ${msg}`, { position: "top-center", autoClose: 4000 });
    }
  };

  return (
    <>
      <TopNavbar showWelcomeMessage={false} showSearch={false} />

      <div className="posted-products">
        <h2 className="page-title">📦 Bidhaa Zilizopostiwa</h2>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="filterType" style={{ marginRight: "8px" }}>
            Chagua Aina ya Bidhaa:
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "180px",
            }}
          >
            <option value="all">Zote</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filteredItems.length === 0 ? (
          <p className="empty-text">
            Hakuna bidhaa zilizopostiwa kwa aina hii.
          </p>
        ) : (
          <div className="posted-products-scroll">
            {filteredItems.map((item) => (
              <PostedProductCard
                key={`${item.source}-${item.id}`}
                item={item}
                addToCart={(item) => {
                  addToCart(item);
                  toast.info(
                    `🛒 ${item.product_name} imeongezwa kwenye kikapu!`,
                    {
                      position: "top-center",
                      autoClose: 2000,
                    }
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ textAlign: "center", marginBottom: "1px" }}>
              Thibitisha Oda Yako
            </h2>

            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                marginBottom: "1px",
              }}
            >
              {cartItems.length === 0 ? (
                <p>Hakuna bidhaa kwenye kikapu.</p>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="cart-item-preview"
                    style={{
                      display: "flex",
                      gap: "9px",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <img
                      src={`${API_BASE_URL}/uploads/${
                        item.image_filename || item.image
                      }`}
                      alt={item.product_name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p>
                        <strong>{item.product_name}</strong>
                      </p>
                      <p>
                        <strong>{item.product_type}</strong>
                      </p>
                      <p>
                        {item.quantity} x {formatCurrency(item.unit_price)} ={" "}
                        <strong>
                          {formatCurrency(item.unit_price * item.quantity)}
                        </strong>
                      </p>

                      {/* Quantity controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Punguza */}
                        <button
                          type="button"
                          onClick={() => {
                            decreaseQuantity(item.uniqueId);
                            toast.info(`➖ ${item.product_name} imepunguzwa`, {
                              position: "top-center",
                              autoClose: 1500,
                            });
                          }}
                          aria-label={`Punguza ${item.product_name}`}
                          style={{
                            width: "45px",
                            height: "44px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#dc3545",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                          }}
                        >
                          &minus;
                        </button>

                        {/* Quantity namba */}
                        <span style={{ minWidth: "40px", textAlign: "center", fontWeight: "bold" }}>
                          {item.quantity}
                        </span>

                        {/* Ongeza */}
                        <button
                          type="button"
                          onClick={() => {
                            increaseQuantity(item.uniqueId);
                            toast.info(`➕ ${item.product_name} imeongezwa`, {
                              position: "top-center",
                              autoClose: 1500,
                            });
                          }}
                          aria-label={`Ongeza ${item.product_name}`}
                          style={{
                            width: "45px",
                            height: "44px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#28a745",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p>
              <strong>Jumla ya Malipo:</strong> {formatCurrency(totalPrice)}
            </p>

            <form onSubmit={handleOrderSubmit}>
              <input
                type="text"
                placeholder="Jina kamili"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Namba ya Simu (mfano: 0712345678 au +255712345678)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                pattern="^(0\d{9}|\+255\d{9}|255\d{9})$"
                title="Tafadhali weka namba sahihi ya simu"
              />
              <input
                type="email"
                placeholder="Barua pepe (mfano: jina@gmail.com)"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Eneo la Kuwasilisha"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                required
              />
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value)}
                required
              >
                <option value="">Chagua Delivery</option>
                <option value="yes">Ndiyo</option>
                <option value="no">Hapana</option>
              </select>
              <button type="submit" style={{ marginTop: "12px" }}>
                ✅ Thibitisha Oda
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ marginTop: "11px" }}
              >
                ❌ Funga
              </button>
            </form>
          </div>
        </div>
      )}


      <BottomNavbar className="bottom-navbar" />
    </>
  );
}
