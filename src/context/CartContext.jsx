import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (item) => {
    // Generate uniqueId based on product_name + product_type + source
    const uniqueId = `${item.product_name}-${item.product_type}-${item.source}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.uniqueId === uniqueId);
      if (existing) {
        // Increase quantity if same uniqueId
        return prev.map((i) =>
          i.uniqueId === uniqueId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      // Add new item with uniqueId
      return [...prev, { ...item, quantity: item.quantity || 1, uniqueId }];
    });
  };

  const increaseQuantity = (uniqueId, max = 100) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId && item.quantity < max
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (uniqueId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
