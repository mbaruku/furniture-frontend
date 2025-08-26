// TopNavbar.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import "./HomeTopNavbar.css";

export default function HomeTopNavbar() {
  return (
    <motion.nav
      className="top-navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-content container">
        <div className="logo-with-name">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" />
            <span className="store-name">Mkombozi Furniture Store</span>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Nyumbani</Link>
          <Link to="/products">Bidhaa</Link>
          <Link to="/videos">Matangazo</Link>
          <Link to="/about">Kuhusu Sisi</Link>
        </div>
      </div>
    </motion.nav>
  );
}
