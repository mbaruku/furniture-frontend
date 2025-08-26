import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, FaWarehouse, FaCogs, FaShoppingCart, FaClipboardList, 
  FaChartLine, FaCommentDots, FaVideo, FaFileInvoice, FaTools, 
  FaCalculator
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./AdminDashboard.css";
import { toast } from "react-toastify";

import GodownPage from "./Godown/Godown";
import WorkshopPage from "./Godown/WorkShopPage";
import AdminOrders from "./AdminOrders";
import ManualOrders from "./ManualOrders";
import ManualOrderForm from "./ManualOrderForm";
import OfficeExpenses from "./OfficeExpenses";
import AdminUploadVideo from "./AdminUploadVideo";
import DailyReportExport from "./DailyReportExport";
import AdminMessagesAndSubscribers from "./AdminMessagesAndSubscribers";
import RegisterEmployee from "../components/RegisterEmployee";
import EmployeesList from "../components/EmployeesList";


/**
 * 
 * @param {*} param0 expects { isSuperAdmin } from login
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function AdminDashboard({ isSuperAdmin }) {
  const navigate = useNavigate();

  // default active section
  const defaultSection = isSuperAdmin ? "dashboard" : "orders";
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <RegisterEmployee />;
      case "confirmation":
        return <EmployeesList />;
      case "godown":
        return <GodownPage />;
      case "workshop":
        return <WorkshopPage />;
      case "orders":
        return <AdminOrders />;
      case "Manualorders":
        return <ManualOrderForm />;
      case "manual-orders":
        return <ManualOrders />;
      case "office-expenses":
        return <OfficeExpenses />;  
      case "report":
        return <DailyReportExport />;
      case "comments":
        return <AdminMessagesAndSubscribers />;
      case "video":
        return <AdminUploadVideo />;
      default:
        return <h4>Chagua section kutoka sidebar</h4>;
    }
  };

  // menu kwa super admin
  const fullMenuItems = [
    { key: "dashboard", label: "Register Employee", icon: <FaUsers /> },
    { key: "confirmation", label: "Employees List", icon: <FaUsers /> },
    { key: "godown", label: "Godown / Stoo", icon: <FaWarehouse /> },
    { key: "workshop", label: "Workshop", icon: <FaTools /> },
    { key: "orders", label: "Online Orders", icon: <FaShoppingCart /> },
    { key: "Manualorders", label: "Manual Orders Form", icon: <FaClipboardList /> },
    { key: "manual-orders", label: "Manual Orders", icon: <FaFileInvoice /> },
    { key: "office-expenses", label: "Office-Expenses", icon: <FaCalculator /> },
    { key: "report", label: "Ripoti ya Mauzo", icon: <FaChartLine /> },
    { key: "comments", label: "Maoni ya Wateja", icon: <FaCommentDots /> },
    { key: "video", label: "Video Advertisements", icon: <FaVideo /> },
  ];

  // menu kwa admins wa kawaida
  const limitedMenuItems = [
    { key: "orders", label: "Online Orders", icon: <FaShoppingCart /> },
    { key: "Manualorders", label: "Manual Orders Form", icon: <FaClipboardList /> },
    { key: "manual-orders", label: "Manual Orders", icon: <FaFileInvoice /> },
  ];

  const menuItems = isSuperAdmin ? fullMenuItems : limitedMenuItems;

  // handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/admins/logout`, {}, { withCredentials: true });
      alert("Umetoka kwenye admin dashboard"); // Feedback ya rahisi
      window.location.reload(); // Optional: reload page baada ya logout
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout haikuweza kufanyika");
    }
  };

  return (
    <div className="d-flex admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
          {!sidebarCollapsed && <h4>{isSuperAdmin ? "Admin Mkuu Panel" : "Admin Panel"}</h4>}
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? "➤" : "⬅"}
          </button>
        </div>
        <ul className="nav flex-column mt-2">
          {menuItems.map(item => (
            <li className="nav-item" key={item.key}>
              <button
                className={`nav-link d-flex align-items-center ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                <span className="me-2">{item.icon}</span>
                {!sidebarCollapsed && item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-3">
      <div 
  className="main-content flex-grow-1 p-3"
  style={{ position: "relative" }}
>
  <div 
    style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: "1rem" 
    }}
  >
    <h2 className="page-title">{activeSection.toUpperCase()}</h2>
    <button 
      onClick={handleLogout}
      style={{
        fontSize: "0.8rem",      // punguza ukubwa wa font
        padding: "0.25rem 0.5rem", // punguza padding
        height: "28px",           // urefu maalum
        lineHeight: 1
      }}
    >
      🚪 Logout
    </button>
  </div>
</div>

        <hr />
        {renderSection()}
      </div>
    </div>
  );
}
