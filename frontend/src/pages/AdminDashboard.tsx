import React, { useEffect, useState } from 'react';
import { Shield, Database, Utensils, ShoppingBag, Layers } from 'lucide-react';
import api from '../api/axios';
import { AdminRestaurants } from './AdminRestaurants';
import { AdminFoods } from './AdminFoods';
import { AdminOrders } from './AdminOrders';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'foods' | 'orders'>('restaurants');
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await api.get('/db-status');
      setDbStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch DB status:', err);
    }
  };

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield color="#e23744" size={28} /> YUMZO Admin Portal
          </h2>
          <p style={{ color: '#696969', fontSize: '14px' }}>
            MongoDB NoSQL Database CRUD Management Dashboard
          </p>
        </div>
        <span className="logo-badge" style={{ backgroundColor: '#e23744', fontSize: '13px', padding: '6px 12px' }}>
          {dbStatus?.database_engine || 'MongoDB Connected'}
        </span>
      </div>

      {/* NoSQL Stats Grid */}
      {dbStatus && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#fff0f1', padding: '12px', borderRadius: '12px' }}>
              <Utensils color="#e23744" size={24} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#696969' }}>Restaurants Collection</p>
              <h3 style={{ fontSize: '24px' }}>{dbStatus.counts.restaurants}</h3>
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#fff0f1', padding: '12px', borderRadius: '12px' }}>
              <Layers color="#e23744" size={24} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#696969' }}>Foods Collection</p>
              <h3 style={{ fontSize: '24px' }}>{dbStatus.counts.foods}</h3>
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#fff0f1', padding: '12px', borderRadius: '12px' }}>
              <ShoppingBag color="#e23744" size={24} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#696969' }}>Orders Collection</p>
              <h3 style={{ fontSize: '24px' }}>{dbStatus.counts.orders}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <div
          className={`admin-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Manage Restaurants
        </div>
        <div
          className={`admin-tab ${activeTab === 'foods' ? 'active' : ''}`}
          onClick={() => setActiveTab('foods')}
        >
          Manage Food Items
        </div>
        <div
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Customer Orders
        </div>
      </div>

      {/* Active Tab Content */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        {activeTab === 'restaurants' && <AdminRestaurants />}
        {activeTab === 'foods' && <AdminFoods />}
        {activeTab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
};
