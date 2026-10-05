# TOMOTO 🍅 – Online Food Delivery System

## Project Objective
The main objective of **TOMOTO** is to demonstrate **MongoDB as a NoSQL database** in a full-stack college project. It showcases document-oriented data modeling, nested document structures, embedded arrays, and complete CRUD operations using PyMongo and FastAPI with a modern React + TypeScript frontend.

> **"MongoDB is used as the primary NoSQL database for storing users, restaurants, food items and orders using document-based data structures."**

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, CSS3, React Router DOM, Axios, Lucide React
- **Backend**: Python 3.12+, FastAPI, PyMongo, Pydantic
- **Database**: MongoDB (NoSQL Document Store)

---

## 📦 MongoDB Collections & NoSQL Schema

### 1. `users`
Stores basic customer profiles:
```json
{
  "_id": "6ac3adcea8bed82665f03a6d",
  "name": "Rahul Kumar",
  "phone": "9876543210",
  "email": "rahul@gmail.com"
}
```

### 2. `restaurants`
Stores restaurant details:
```json
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Bengaluru Biryani House",
  "cuisine": "Biryani & South Indian",
  "description": "Famous Hyderabadi & Donne Biryani cooked with fragrant spices",
  "rating": 4.8,
  "delivery_time": "25-35 min",
  "image": "https://images.unsplash.com/..."
}
```

### 3. `foods`
Stores food items linked via `restaurant_id`:
```json
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
  "restaurant_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Hyderabadi Chicken Biryani",
  "description": "Basmati rice cooked with marinated chicken and aromatic spices",
  "category": "Biryani",
  "price": 280,
  "image": "https://images.unsplash.com/...",
  "available": true
}
```

### 4. `orders` *(Demonstrates NoSQL Nested Objects & Embedded Arrays)*
```json
{
  "_id": "6ac3adcea8bed82665f03a6d",
  "customer_name": "Rahul Kumar",
  "phone": "9876543210",
  "restaurant_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "restaurant_name": "Bengaluru Biryani House",
  "items": [
    {
      "food_name": "Hyderabadi Chicken Biryani",
      "quantity": 2,
      "price": 280
    },
    {
      "food_name": "Paneer Dum Biryani",
      "quantity": 1,
      "price": 240
    }
  ],
  "delivery_address": {
    "address": "123, 4th Cross, MG Road",
    "city": "Bengaluru",
    "pincode": "560001"
  },
  "total_amount": 800,
  "payment_method": "Cash on Delivery",
  "status": "Pending",
  "created_at": "2026-10-05 19:15:00"
}
```

---

## 🔑 NoSQL Concepts Demonstrated

1. **Document Database Model**: Storing structured/unstructured data in JSON-like BSON documents.
2. **Embedded Arrays**: Storing order line items directly inside the order document (`items` array).
3. **Nested Documents**: Storing delivery address details as an embedded sub-document (`delivery_address` object).
4. **Dynamic ObjectIds**: Automatic generation and handling of unique 24-character hexadecimal BSON ObjectIds.
5. **PyMongo Querying**: Direct execution of MongoDB CRUD methods (`find`, `find_one`, `insert_one`, `insert_many`, `update_one`, `delete_one`).

---

## ⚡ Features

### 👤 Customer Features
- **Home Page**: Search bar, category quick filters (Biryani, Pizza, Burger, South Indian, Chinese, Desserts), featured restaurants, popular food items.
- **Restaurant Menu**: View restaurant rating, delivery time, menu items, and add to cart.
- **Interactive Cart**: Real-time quantity adjustments, subtotal calculation, dynamic delivery charge calculation, and total bill.
- **Checkout**: Easy Cash on Delivery checkout form, persisting order directly to MongoDB.
- **My Orders**: Real-time order status tracking (Pending, Confirmed, Preparing, Delivered) with phone number lookup.

### 🛡️ Admin Features (`/admin`)
- **Dashboard Overview**: Real-time MongoDB collection document counts.
- **Restaurant Management**: Create, Read, Edit, and Delete restaurants.
- **Food Management**: Create, Read, Edit, and Delete food items with restaurant selection.
- **Order Management**: Inspect full MongoDB order documents and update order status live.

---

## 🚀 How to Run locally

### 1. Backend (FastAPI + PyMongo)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000` and automatically populate sample data on initial startup!

### 2. Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```
The React frontend will start at `http://127.0.0.1:5173`.

---

## 📡 REST API Endpoints

- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/{id}` - Update restaurant
- `DELETE /api/restaurants/{id}` - Delete restaurant
- `GET /api/foods` - Get all foods (with optional `restaurant_id` & `category` filters)
- `POST /api/foods` - Create food item
- `PUT /api/foods/{id}` - Update food item
- `DELETE /api/foods/{id}` - Delete food item
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get all orders (or filter by `phone`)
- `PUT /api/orders/{id}/status` - Update order status
- `GET /api/db-status` - View MongoDB connection metrics and collection counts
