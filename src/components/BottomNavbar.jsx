import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChair, FaInfoCircle} from 'react-icons/fa';  // Ongeza FaVideo
import './BottomNavbar.css';

export default function BottomNavbar() {
  const location = useLocation();

  return (
    <div className="bottom-navbar shadow-lg">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        <FaHome size={20} />
        <span>Nyumbani</span>
      </Link>

      <Link to="/posted" className={location.pathname === '/posted' ? 'active' : ''}>
        <FaChair size={20} />
        <span>Bidhaa Zetu</span>
      </Link>

      <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
        <FaInfoCircle size={20} />
        <span>Kuhusu Sisi</span>
      </Link>

    </div>
  );
}
