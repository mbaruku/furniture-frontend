import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Mkombozi Furniture</h3>
          <p>Samani zenye ubora wa hali ya juu kwa matumizi ya nyumbani na ofisini.</p>
        </div>

        <div className="footer-contact">
          <h4>Wasiliana Nasi</h4>
          <p><FaPhoneAlt /> +255 764 262 210</p>
          <p><FaWhatsapp /> +255 675 310 073</p>
          <p><FaMapMarkerAlt /> Kinindoni Mkwajuni, Sinza Africsana</p>
        </div>

        <div className="footer-social">
          <h4>Mitandao ya Kijamii</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://wa.me/255675310073" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
          </div>
        </div>
         © {new Date().getFullYear()} Mkombozi Furniture. All rights reserved.
      </div>
      <div className="footer-bottom">
   
      </div>
    </footer>
  );
};

export default Footer;
