// src/data/useProducts.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      });
  }, []);

  return products;
}
