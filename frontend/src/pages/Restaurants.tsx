import React, { useEffect, useState } from 'react';
import { Search, Utensils } from 'lucide-react';
import api from '../api/axios';
import { Restaurant } from '../types';
import { RestaurantCard } from '../components/RestaurantCard';

export const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants');
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <h2>Explore Restaurants</h2>
          <p style={{ color: '#696969', fontSize: '14px' }}>Discover top rated restaurants near you</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search restaurants or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
        </div>
      </div>

      {loading ? (
        <p>Loading restaurants from MongoDB...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#696969' }}>
          <Utensils size={48} color="#e23744" style={{ marginBottom: '12px' }} />
          <h3>No Restaurants Found</h3>
          <p>Try searching for another restaurant or cuisine</p>
        </div>
      ) : (
        <div className="grid-restaurants">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};
