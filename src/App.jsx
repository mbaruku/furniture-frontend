import PrivateRoute from './components/PrivateRoute'; // hakikisha path ni sahihi
import HomePage from './Pages/HomePage';
import AboutPage from './components/AboutPage';
import AdminLogin from './Pages/AdminLogin';
import AdminRegisterForm from './Pages/RegisterAdmin';
import AdminDashboard from './Pages/AdminDashboard';
import Godown from './Pages/Godown/Godown';
import PostedProductsPage from './Pages/Godown/PostedProduct';
import AdminOrders from './Pages/AdminOrders';
import AdminMessagesAndSubscribers from './Pages/AdminMessagesAndSubscribers';
import { CartProvider } from 'react-use-cart';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';








function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Routes ambazo hazihitaji private */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/posted" element={<PostedProductsPage />} />
          <Route path="/admin/register" element={<AdminRegisterForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Private routes - zinahitaji login */}
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/godown" 
            element={
              <PrivateRoute>
                <Godown />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <PrivateRoute>
                <AdminOrders />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <PrivateRoute>
                <AdminMessagesAndSubscribers />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </CartProvider>
  );
}

export default App;
