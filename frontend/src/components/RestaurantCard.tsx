import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img src={restaurant.image} alt={restaurant.name} className="card-img" />
        <span className="card-tag">
          <Clock size={12} /> {restaurant.delivery_time}
        </span>
      </div>
      <div className="card-body">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h3 className="card-title">{restaurant.name}</h3>
            <span className="rating-badge">
              <Star size={12} fill="white" /> {restaurant.rating}
            </span>
          </div>
          <div className="card-subtitle">{restaurant.cuisine}</div>
          <p className="card-desc">{restaurant.description}</p>
        </div>
        <div className="card-footer">
          <Link to={`/restaurant/${restaurant._id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
