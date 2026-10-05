import React, { useEffect, useState } from 'react';
import { Search, Flame, Award, Bike, PackageCheck } from 'lucide-react';
import api from '../api/axios';
import { Restaurant, Food } from '../types';
import { RestaurantCard } from '../components/RestaurantCard';
import { FoodCard } from '../components/FoodCard';

const CATEGORIES = [
  { name: 'All', icon: '🍽️' },
  { name: 'Biryani', icon: '🍲' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'South Indian', icon: '🫓' },
  { name: 'Bakery & Desserts', icon: '🍰' },
  { name: 'Ice Creams', icon: '🍨' },
];

export const Home: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [restRes, foodRes] = await Promise.all([
        api.get('/restaurants'),
        api.get('/foods')
      ]);
      setRestaurants(restRes.data);
      setFoods(foodRes.data);
    } catch (err) {
      console.error('Failed to fetch data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFoods = foods.filter((f) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      f.category === selectedCategory ||
      (selectedCategory === 'Bakery & Desserts' && f.category === 'Desserts') ||
      (selectedCategory === 'Ice Creams' && f.category === 'Ice Creams');
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container">
      {/* Hero Section with Moving Bike Delivery Animation */}
      <div className="hero">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Bike size={42} color="white" /> YUMZO
        </h1>
        <p>Your cravings, delivered.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Magnolia Bakery, biryani, ice cream, pizza, burgers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary">
            <Search size={18} /> Search
          </button>
        </div>

        {/* Moving Delivery Bike Animation */}
        <div className="hero-bike-wrapper">
          <div className="moving-bike">
            <Bike size={20} color="white" />
            <span>YUMZO Express Delivering Hot & Fresh!</span>
            <PackageCheck size={18} color="#fef08a" />
          </div>
        </div>
      </div>

      {/* Food Categories */}
      <div className="category-section">
        <div className="section-title">
          <span>Categories</span>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Food Items */}
      <div className="category-section">
        <div className="section-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame color="#e23744" size={22} /> Popular Food Items ({filteredFoods.length})
          </span>
        </div>
        {loading ? (
          <p>Loading food menu...</p>
        ) : filteredFoods.length === 0 ? (
          <p style={{ color: '#696969' }}>No food items found matching your search.</p>
        ) : (
          <div className="grid-foods">
            {filteredFoods.slice(0, 8).map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Restaurants Section */}
      <div className="category-section" style={{ marginTop: '40px' }}>
        <div className="section-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award color="#e23744" size={22} /> Featured Restaurants ({filteredRestaurants.length})
          </span>
        </div>
        {loading ? (
          <p>Loading restaurants...</p>
        ) : (
          <div className="grid-restaurants">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
