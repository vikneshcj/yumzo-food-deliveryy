import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Food } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  food: Food;
  restaurantName?: string;
}

export const FoodCard: React.FC<Props> = ({ food, restaurantName }) => {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const cartItem = cart.find((item) => item.food._id === food._id);

  return (
    <div className="card">
      <div className="card-img-wrapper" style={{ height: '160px' }}>
        <img src={food.image} alt={food.name} className="card-img" />
        <span className="card-tag" style={{ background: '#e23744', right: 'auto', left: '12px' }}>
          {food.category}
        </span>
      </div>
      <div className="card-body">
        <div>
          <h4 className="card-title" style={{ fontSize: '16px' }}>{food.name}</h4>
          <p className="card-desc" style={{ fontSize: '12px', marginBottom: '12px' }}>{food.description}</p>
        </div>
        <div className="card-footer">
          <span className="price">₹{food.price}</span>
          {cartItem ? (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => decreaseQuantity(food._id)}>
                <Minus size={14} />
              </button>
              <span className="qty-val">{cartItem.quantity}</span>
              <button className="qty-btn" onClick={() => increaseQuantity(food._id)}>
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => addToCart(food, restaurantName)}
              disabled={!food.available}
            >
              <ShoppingCart size={14} /> {food.available ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
