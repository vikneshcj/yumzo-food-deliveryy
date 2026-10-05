import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../api/axios';
import { Food, Restaurant } from '../types';

export const AdminFoods: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    restaurant_id: '',
    description: '',
    category: 'Biryani',
    price: 200,
    image: '',
    available: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodsRes, restsRes] = await Promise.all([
        api.get('/foods'),
        api.get('/restaurants'),
      ]);
      setFoods(foodsRes.data);
      setRestaurants(restsRes.data);
    } catch (err) {
      console.error('Failed to fetch foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      restaurant_id: restaurants[0]?._id || '',
      description: '',
      category: 'Biryani',
      price: 200,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      available: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      restaurant_id: food.restaurant_id,
      description: food.description,
      category: food.category,
      price: food.price,
      image: food.image,
      available: food.available,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this food item from MongoDB?')) {
      try {
        await api.delete(`/foods/${id}`);
        fetchData();
      } catch (err) {
        console.error('Failed to delete food:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood._id}`, formData);
      } else {
        await api.post('/foods', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save food:', err);
    }
  };

  const getRestaurantName = (restId: string) => {
    const rest = restaurants.find((r) => r._id === restId);
    return rest ? rest.name : 'Unknown Restaurant';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Food Item Management ({foods.length})</h3>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Food Item
        </button>
      </div>

      {loading ? (
        <p>Loading food menu from MongoDB...</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Item Name</th>
                <th>Restaurant</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>
                    <img src={food.image} alt={food.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  </td>
                  <td>
                    <strong>{food.name}</strong>
                    <br />
                    <small style={{ color: '#696969' }}>{food.description}</small>
                  </td>
                  <td>{getRestaurantName(food.restaurant_id)}</td>
                  <td>
                    <span className="card-tag" style={{ position: 'static', background: '#e23744' }}>
                      {food.category}
                    </span>
                  </td>
                  <td>₹{food.price}</td>
                  <td>
                    <span className={`status-badge ${food.available ? 'status-Delivered' : 'status-Cancelled'}`}>
                      {food.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(food)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(food._id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Food Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Restaurant</label>
                <select
                  className="form-control"
                  value={formData.restaurant_id}
                  onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="South Indian">South Indian</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#e23744' }}
                />
                <label htmlFor="available" style={{ margin: 0, cursor: 'pointer' }}>Available in Menu</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFood ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
