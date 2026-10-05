import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin, Phone, User as UserIcon, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export const Checkout: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Rahul Kumar',
    phone: '9876543210',
    address: '123, 4th Cross, MG Road',
    city: 'Bengaluru',
    pincode: '560001',
  });

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [error, setError] = useState('');

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>No items in cart for checkout</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      setError('Please fill in all delivery details.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create Order Document for MongoDB (demonstrating embedded arrays and nested objects)
      const orderPayload = {
        customer_name: formData.name,
        phone: formData.phone,
        restaurant_id: cart[0]?.restaurant_id || 'rest_default',
        restaurant_name: cart[0]?.restaurant_name || 'YUMZO Partner Restaurant',
        items: cart.map((item) => ({
          food_name: item.food.name,
          quantity: item.quantity,
          price: item.food.price,
        })),
        delivery_address: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        total_amount: total,
        payment_method: 'Cash on Delivery',
      };

      const response = await api.post('/orders', orderPayload);
      setPlacedOrder(response.data);
      // Store phone for My Orders lookup
      localStorage.setItem('yumzo_user_phone', formData.phone);
      clearCart();
    } catch (err: any) {
      console.error('Failed to place order in MongoDB:', err);
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <CheckCircle2 size={72} color="#16a34a" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '28px', color: '#16a34a' }}>Order Placed Successfully! 🎉</h2>
          <p style={{ color: '#696969', margin: '8px 0 20px' }}>
            Your order has been saved directly to MongoDB NoSQL database.
          </p>

          <div
            style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'left',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ fontSize: '13px', color: '#696969' }}>Order ID (MongoDB ObjectId):</p>
            <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#e23744', marginBottom: '12px' }}>
              {placedOrder._id}
            </p>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <p><strong>Customer:</strong> {placedOrder.customer_name} ({placedOrder.phone})</p>
              <p><strong>Restaurant:</strong> {placedOrder.restaurant_name}</p>
              <p><strong>Delivery Address:</strong> {placedOrder.delivery_address.address}, {placedOrder.delivery_address.city} - {placedOrder.delivery_address.pincode}</p>
              <p><strong>Total Paid (COD):</strong> ₹{placedOrder.total_amount}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${placedOrder.status}`}>{placedOrder.status}</span></p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/my-orders')}>
              Track Order in "My Orders"
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/cart" className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h2 style={{ marginBottom: '24px' }}>Checkout Delivery Details 📦</h2>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="cart-layout">
        {/* Form */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <form onSubmit={handlePlaceOrder}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserIcon size={20} color="#e23744" /> Customer Information
            </h3>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Rahul Kumar"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <h3 style={{ fontSize: '18px', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#e23744" /> Delivery Address
            </h3>

            <div className="form-group">
              <label>Street Address / House No.</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="123, 4th Cross, MG Road"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  placeholder="560001"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h3 style={{ fontSize: '18px', margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#e23744" /> Payment Method
            </h3>

            <div
              style={{
                border: '2px solid #e23744',
                background: '#fff0f1',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <input type="radio" checked readOnly style={{ accentColor: '#e23744', width: '18px', height: '18px' }} />
              <div>
                <strong>Cash on Delivery (COD)</strong>
                <p style={{ fontSize: '12px', color: '#696969' }}>Pay cash to driver when food arrives</p>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving Order to MongoDB...' : `Place Order (₹${total})`}
            </button>
          </form>
        </div>

        {/* Mini Summary */}
        <div className="order-summary">
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Items Summary ({cart.length})</h3>
          {cart.map((item) => (
            <div key={item.food._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span>{item.quantity}x {item.food.name}</span>
              <span>₹{item.food.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-total" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Payable</span>
              <span style={{ color: '#e23744' }}>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
