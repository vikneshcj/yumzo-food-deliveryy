import React, { useEffect, useState } from 'react';
import { Eye, X, MapPin } from 'lucide-react';
import api from '../api/axios';
import { Order } from '../types';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status in MongoDB:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Order Management ({orders.length})</h3>
        <button className="btn btn-secondary btn-sm" onClick={fetchOrders}>
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <p>Loading orders from MongoDB database...</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th>Change Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{order._id}</td>
                  <td>
                    <strong>{order.customer_name}</strong>
                    <br />
                    <small style={{ color: '#696969' }}>{order.phone}</small>
                  </td>
                  <td>{order.restaurant_name}</td>
                  <td><strong>₹{order.total_amount}</strong></td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <small style={{ color: '#696969' }}>{order.created_at}</small>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '13px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(order)}>
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>MongoDB Order Details Document</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '12px', color: '#696969' }}>Document ID (ObjectId):</p>
              <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#e23744', marginBottom: '8px' }}>
                {selectedOrder._id}
              </p>
              <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Restaurant:</strong> {selectedOrder.restaurant_name}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
              <p><strong>Current Status:</strong> <OrderStatusBadge status={selectedOrder.status} /></p>
            </div>

            <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Embedded Array Items:</h4>
            <div className="table-responsive" style={{ marginBottom: '20px' }}>
              <table style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.food_name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Nested Delivery Address Object:</h4>
            <div style={{ background: '#fff0f1', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fecdd3', fontSize: '13px' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#e23744" /> {selectedOrder.delivery_address?.address}, {selectedOrder.delivery_address?.city} - {selectedOrder.delivery_address?.pincode}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>Total: ₹{selectedOrder.total_amount}</span>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
