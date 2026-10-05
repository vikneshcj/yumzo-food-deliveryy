import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '500px', margin: '0 auto', border: '1px solid var(--border-color)' }}>
          <ShoppingBag size={64} color="#e23744" style={{ marginBottom: '16px' }} />
          <h2>Your Cart is Empty</h2>
          <p style={{ color: '#696969', margin: '8px 0 24px' }}>
            Looks like you haven't added any delicious food items to your cart yet.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Explore Menu & Add Food
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Shopping Cart 🛒</h2>
        <button className="btn btn-secondary btn-sm" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.food._id} className="cart-item">
              <div className="cart-item-info">
                <img src={item.food.image} alt={item.food.name} className="cart-item-img" />
                <div>
                  <h4 style={{ fontSize: '15px' }}>{item.food.name}</h4>
                  <p style={{ fontSize: '12px', color: '#696969' }}>
                    ₹{item.food.price} x {item.quantity}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => decreaseQuantity(item.food._id)}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => increaseQuantity(item.food._id)}>
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ fontWeight: 700, width: '70px', textAlign: 'right' }}>
                  ₹{item.food.price * item.quantity}
                </div>
                <button
                  onClick={() => removeFromCart(item.food._id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <Link to="/restaurants" className="nav-link" style={{ display: 'inline-flex', padding: 0 }}>
              <ArrowLeft size={16} /> Add more items
            </Link>
          </div>
        </div>

        {/* Price & Checkout Summary */}
        <div className="order-summary">
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Bill Details</h3>
          <div className="summary-row">
            <span>Item Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span> : `₹${deliveryFee}`}</span>
          </div>
          {deliveryFee > 0 && (
            <p style={{ fontSize: '11px', color: '#16a34a', marginBottom: '12px' }}>
              Add items worth ₹{500 - subtotal} more for FREE Delivery!
            </p>
          )}
          <div className="summary-row summary-total">
            <span>To Pay</span>
            <span style={{ color: '#e23744' }}>₹{total}</span>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ marginTop: '20px' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
