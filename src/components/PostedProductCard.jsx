import React from "react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utiis/helpers";
import "./PostedProductCard.css";


 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostedProductCard({ item }) {
  const { addToCart } = useCart();

  // Detect image URL based on source
  let imageUrl;
  if (item.source === "workshop") {
    imageUrl = `${API_BASE_URL}${item.image}`;
  } else {
    imageUrl = `${API_BASE_URL}/uploads/${item.image_filename || item.image}`;
  }

  // Render tag badges
  const renderTag = () => {
    if (item.discount_percentage > 0) {
      return <div className="discount-badge">{item.discount_percentage}% OFF</div>;
    }
    if (item.category_type === "new") {
      return <div className="tag-badge new">🆕 Mpya</div>;
    }
    if (item.category_type === "best") {
      return <div className="tag-badge best">🔥 Inayotamba</div>;
    }
    return null;
  };

  // Render discount expiry
  const renderExpiry = () => {
    if (item.discount_percentage > 0 && item.discount_expiry) {
      const formattedDate = new Date(item.discount_expiry).toLocaleDateString();
      return (
        <p className="discount-expiry" style={{ fontSize: "13px", color: "#c00" }}>
          Punguzo linaisha: <strong>{formattedDate}</strong>
        </p>
      );
    }
    return null;
  };

  // Render price
  const renderPrice = () => {
    if (item.discount_percentage > 0) {
      const discountedPrice = item.unit_price * (1 - item.discount_percentage / 100);
      return (
        <p className="item-price">
          Bei:{" "}
          <span
            className="price-old"
            style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}
          >
            {formatCurrency(item.unit_price)}
          </span>
          <span className="price-highlight">{formatCurrency(discountedPrice)}</span>
        </p>
      );
    } else {
      return (
        <p className="item-price">
          Bei: <span className="price-highlight">{formatCurrency(item.unit_price)}</span>
        </p>
      );
    }
  };

  // Add item to cart
  const handleAddToCart = () => {
    const discountedPrice =
      item.discount_percentage > 0
        ? item.unit_price - (item.unit_price * item.discount_percentage) / 100
        : item.unit_price;

    const itemToAdd = {
      ...item,
      unit_price: discountedPrice,
      // Use source + id to make unique
      uniqueId: `${item.source}-${item.id ?? item.product_name}`,
      quantity: 1,
    };

    addToCart(itemToAdd);
  };

  return (
    <div className="product-grid">
      <div className="image-wrapper">
        {renderTag()}
        <img src={imageUrl} alt={item.product_name} className="item-image" />
      </div>

      <div className="item-details">
        <h3 className="item-name">{item.product_name}</h3>
        <p className="item-category">Aina: {item.product_type || "Haijatajwa"}</p>

        {renderPrice()}
        {renderExpiry()}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          ➕ Ongeza Kikapuni
        </button>
      </div>
    </div>
  );
}
