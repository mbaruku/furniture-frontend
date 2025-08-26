
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./CartButton.css";

const CartButton = () => {
  const { cartItems, setShowModal } = useCart();

  return (
    <button className="cart-button" onClick={() => setShowModal(true)}>
      <div className="icon-wrapper">
        <FaShoppingCart className="cart-icon" />
        {cartItems.length > 0 && (
          <span className="cart-count-badge">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </div>
      Kikapu
    </button>
  );
};

export default CartButton;


