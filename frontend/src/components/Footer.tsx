import React from 'react';
import { Database, Bike } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bike size={24} color="#e23744" /> YUMZO
          </div>
          <p style={{ maxWidth: '300px', fontSize: '14px', lineHeight: '1.6' }}>
            Your cravings, delivered. Online Food Delivery System demonstrating MongoDB NoSQL document database, FastAPI REST endpoints, and React TypeScript.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '12px' }}>NoSQL Database Stack</h4>
          <p style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} color="#e23744" /> Database: MongoDB Collections & Documents
          </p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            Backend: FastAPI + PyMongo
          </p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            Frontend: React + Axios + TypeScript
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>YUMZO College Demonstration Project &copy; {new Date().getFullYear()} - Powered by MongoDB NoSQL</p>
      </div>
    </footer>
  );
};
