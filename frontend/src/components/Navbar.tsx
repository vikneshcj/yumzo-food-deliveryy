import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Utensils, Shield, Home, Clock, Bike } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { totalItemsCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bike size={28} color="#e23744" /> YUMZO
          </span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <Home size={18} /> Home
              </Link>
            </li>
            <li>
              <Link to="/restaurants" className={`nav-link ${isActive('/restaurants') ? 'active' : ''}`}>
                <Utensils size={18} /> Restaurants
              </Link>
            </li>
            <li>
              <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
                <ShoppingBag size={18} /> Cart
                {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className={`nav-link ${isActive('/my-orders') ? 'active' : ''}`}>
                <Clock size={18} /> My Orders
              </Link>
            </li>
            <li>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color: '#e23744', fontWeight: 600 }}>
                <Shield size={18} /> Admin Portal
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
