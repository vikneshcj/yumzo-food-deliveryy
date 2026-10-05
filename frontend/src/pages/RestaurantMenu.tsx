import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, ArrowLeft, Utensils } from 'lucide-react';
import api from '../api/axios';
import { Restaurant, Food } from '../types';
import { FoodCard } from '../components/FoodCard';

export const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (restId: string) => {
    try {
      setLoading(true);
      const [restRes, foodsRes] = await Promise.all([
        api.get(`/restaurants/${restId}`),
        api.get(`/foods?restaurant_id=${restId}`),
      ]);
      setRestaurant(restRes.data);
      setFoods(foodsRes.data);
    } catch (err) {
      console.error('Error fetching restaurant menu:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <p>Loading restaurant menu from MongoDB...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Restaurant Not Found</h2>
        <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(foods.map((f) => f.category)))];
  const filteredFoods =
    selectedCategory === 'All' ? foods : foods.filter((f) => f.category === selectedCategory);

  return (
    <div className="container">
      <Link to="/restaurants" className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={16} /> Back to Restaurants
      </Link>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
          marginBottom: '32px',
        }}
      >
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
            }}
          />
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', color: 'white' }}>
            <h1 style={{ color: 'white', fontSize: '32px' }}>{restaurant.name}</h1>
            <p style={{ opacity: 0.9, fontSize: '15px' }}>{restaurant.cuisine}</p>
          </div>
        </div>

        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <p style={{ color: '#696969', fontSize: '14px' }}>{restaurant.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className="rating-badge" style={{ fontSize: '14px', padding: '6px 12px' }}>
              <Star size={16} fill="white" /> {restaurant.rating} Rating
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#696969',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Clock size={16} color="#e23744" /> {restaurant.delivery_time}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ borderRadius: '9999px', fontSize: '13px', padding: '6px 18px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="section-title">
        <span>Menu Items ({filteredFoods.length})</span>
      </div>

      {filteredFoods.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#696969' }}>
          <Utensils size={36} color="#e23744" />
          <p>No food items found in this category.</p>
        </div>
      ) : (
        <div className="grid-foods">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id} food={food} restaurantName={restaurant.name} />
          ))}
        </div>
      )}
    </div>
  );
};
