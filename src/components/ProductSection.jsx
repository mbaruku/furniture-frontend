import React, { useEffect, useState } from "react";
import axios from "axios";
import PostedProductCard from "./PostedProductCard";
import "./ProductSection.css";

 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductSection({ title, categoryType }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Vuta Godown na Workshop items
        const [godownRes, workshopRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/godown/posted`),
          axios.get(`${API_BASE_URL}/api/workshop/posted`),
        ]);

        // Changanya zote na ongeza 'source' property
        const allProducts = [
          ...godownRes.data.map((p) => ({ ...p, source: "godown" })),
          ...workshopRes.data.map((p) => ({ ...p, source: "workshop" })),
        ];

        // Filter kwa categoryType; 'all' inaonyesha zote
        const filtered = allProducts.filter(
          (item) => categoryType === "all" || item.category_type === categoryType
        );

        // Optional: sort by date_added (newest first)
        filtered.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching posted products:", err);
      }
    };

    fetchProducts();
  }, [categoryType]);

  if (!products.length) return null;

  return (
    <div className="product-section-container">
      <h2 className="product-section-title">{title}</h2>

      <div className="horizontal-scroll-container">
        {products.map((product) => (
          <div
            className="scroll-item"
            key={`${product.source}-${product.id ?? product.product_name}`} // unique key
          >
            <PostedProductCard
              item={{
                ...product,
                // fallback image if missing
                image: product.image || (product.source === "godown"
                  ? `/uploads/${product.image_filename || "default.jpg"}`
                  : `/uploads_workshop/${product.image_filename || "default.jpg"}`),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
