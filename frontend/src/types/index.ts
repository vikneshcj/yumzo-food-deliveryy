export interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  description: string;
  rating: number;
  delivery_time: string;
  image: string;
}

export interface Food {
  _id: string;
  restaurant_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
}

export interface CartItem {
  food: Food;
  quantity: number;
  restaurant_id: string;
  restaurant_name: string;
}

export interface OrderItem {
  food_name: string;
  quantity: number;
  price: number;
}

export interface DeliveryAddress {
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  _id: string;
  customer_name: string;
  phone: string;
  restaurant_id: string;
  restaurant_name: string;
  items: OrderItem[];
  delivery_address: DeliveryAddress;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface User {
  _id?: string;
  name: string;
  phone: string;
  email: string;
}
