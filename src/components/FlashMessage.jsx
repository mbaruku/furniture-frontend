// src/components/FlashMessage.jsx
import React from "react";

export default function FlashMessage({ message, type, onClose }) {
  if (!message) return null;

  const bgColor = type === "success" ? "#28a745" : "#dc3545";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "12px 20px",
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1000,
        minWidth: "250px",
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: "12px",
          background: "transparent",
          border: "none",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
}
