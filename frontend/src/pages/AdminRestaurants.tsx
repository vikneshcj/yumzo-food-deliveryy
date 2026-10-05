import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import api from '../api/axios';
import { Restaurant } from '../types';

export const AdminRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRest, setEditingRest] = useState<Restaurant | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    description: '',
    rating: 4.5,
    delivery_time: '30-40 min',
    image: '',
  });

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

  const handleOpenAdd = () => {
    setEditingRest(null);
    setFormData({
      name: '',
      cuisine: '',
      description: '',
      rating: 4.5,
      delivery_time: '30-40 min',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (rest: Restaurant) => {
    setEditingRest(rest);
    setFormData({
      name: rest.name,
      cuisine: rest.cuisine,
      description: rest.description,
      rating: rest.rating,
      delivery_time: rest.delivery_time,
      image: rest.image,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant and its food items from MongoDB?')) {
      try {
        await api.delete(`/restaurants/${id}`);
        fetchRestaurants();
      } catch (err) {
        console.error('Failed to delete restaurant:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRest) {
        await api.put(`/restaurants/${editingRest._id}`, formData);
      } else {
        await api.post('/restaurants', formData);
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (err) {
      console.error('Failed to save restaurant:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Restaurant Management ({restaurants.length})</h3>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Restaurant
        </button>
      </div>

      {loading ? (
        <p>Loading restaurants from MongoDB...</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Restaurant Name</th>
                <th>Cuisine</th>
                <th>Rating</th>
                <th>Delivery Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((rest) => (
                <tr key={rest._id}>
                  <td>
                    <img src={rest.image} alt={rest.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  </td>
                  <td>
                    <strong>{rest.name}</strong>
                    <br />
                    <small style={{ color: '#696969' }}>{rest.description}</small>
                  </td>
                  <td>{rest.cuisine}</td>
                  <td>
                    <span className="rating-badge">
                      <Star size={12} fill="white" /> {rest.rating}
                    </span>
                  </td>
                  <td>{rest.delivery_time}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(rest)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rest._id)}>
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
              <h3>{editingRest ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cuisine</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Indian, Chinese, Italian"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Rating (1.0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Time</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="30-40 min"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                    required
                  />
                </div>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRest ? 'Save Changes' : 'Create Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
