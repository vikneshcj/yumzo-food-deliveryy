import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Clock, MapPin, Phone, Database } from 'lucide-react';
import api from '../api/axios';
import { Order } from '../types';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [phoneFilter, setPhoneFilter] = useState(() => {
    return localStorage.getItem('yumzo_user_phone') || '';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = phoneFilter ? `/orders?phone=${phoneFilter}` : '/orders';
      const res = await api.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="container">
      <div className="admin-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>My Orders 📦</h2>
          <p style={{ color: '#696969', fontSize: '14px' }}>
            Live status of your orders fetched directly from MongoDB <code>orders</code> collection
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by phone number..."
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            style={{ width: '220px' }}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <Search size={16} /> Filter
          </button>
          {phoneFilter && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setPhoneFilter('');
                setTimeout(() => fetchOrders(), 10);
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <p>Loading orders from MongoDB...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <ShoppingBag size={48} color="#e23744" style={{ marginBottom: '12px' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: '#696969', marginTop: '8px' }}>
            {phoneFilter ? `No orders found for phone ${phoneFilter}` : 'You have not placed any orders yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#1c1c1c' }}>{order.restaurant_name}</h3>
                  <p style={{ fontSize: '12px', color: '#696969', fontFamily: 'monospace', marginTop: '2px' }}>
                    Order ID: {order._id}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#696969', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {order.created_at}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              {/* Order Items (MongoDB Array demonstration) */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', color: '#696969', marginBottom: '8px' }}>Ordered Items (NoSQL Embedded Array):</h4>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                      <span>{item.quantity}x {item.food_name}</span>
                      <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address (MongoDB Nested Object demonstration) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ fontSize: '13px', color: '#696969' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#e23744" /> <strong>Address:</strong> {order.delivery_address?.address}, {order.delivery_address?.city} - {order.delivery_address?.pincode}
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Phone size={14} color="#e23744" /> <strong>Customer:</strong> {order.customer_name} ({order.phone})
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', color: '#696969' }}>Total Paid:</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#e23744' }}>
                    ₹{order.total_amount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
