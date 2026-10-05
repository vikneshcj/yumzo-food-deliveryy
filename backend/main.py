import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from bson import ObjectId

from database import (
    db_type,
    restaurants_collection,
    foods_collection,
    orders_collection,
    users_collection
)
from models import (
    RestaurantCreate, RestaurantUpdate,
    FoodCreate, FoodUpdate,
    OrderCreate, OrderStatusUpdate,
    UserCreate
)
from seed_data import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed database with fresh YUMZO data
    seed_database(force=True)
    yield

app = FastAPI(
    title="YUMZO - Online Food Delivery System API",
    description="FastAPI + PyMongo Backend demonstrating MongoDB NoSQL document store for YUMZO",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware to allow React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to YUMZO Online Food Delivery System API",
        "slogan": "Your cravings, delivered.",
        "db_status": db_type,
        "collections": ["users", "restaurants", "foods", "orders"]
    }

@app.post("/api/reseed")
def reseed_api():
    seed_database(force=True)
    return {"message": "Database successfully re-seeded with YUMZO data"}


@app.get("/api/db-status")
def get_db_status():
    return {
        "database_engine": db_type,
        "nosql_features": [
            "Document-based storage",
            "Nested address objects inside order documents",
            "Array of order items embedded in order document",
            "Dynamic PyMongo BSON Queries",
            "CRUD operations"
        ],
        "counts": {
            "restaurants": restaurants_collection.count_documents({}),
            "foods": foods_collection.count_documents({}),
            "users": users_collection.count_documents({}),
            "orders": orders_collection.count_documents({})
        }
    }

# ================= RESTAURANT ENDPOINTS =================

@app.get("/api/restaurants")
def get_restaurants():
    items = list(restaurants_collection.find())
    for item in items:
        item["_id"] = str(item["_id"])
    return items

@app.get("/api/restaurants/{id}")
def get_restaurant(id: str):
    item = restaurants_collection.find_one({"_id": id})
    if not item:
        try:
            item = restaurants_collection.find_one({"_id": ObjectId(id)})
        except Exception:
            pass
    if not item:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    item["_id"] = str(item["_id"])
    return item

@app.post("/api/restaurants", status_code=status.HTTP_201_CREATED)
def create_restaurant(restaurant: RestaurantCreate):
    doc = restaurant.model_dump()
    doc["_id"] = str(ObjectId())
    restaurants_collection.insert_one(doc)
    return doc

@app.put("/api/restaurants/{id}")
def update_restaurant(id: str, restaurant: RestaurantUpdate):
    update_data = {k: v for k, v in restaurant.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    res = restaurants_collection.update_one({"_id": id}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    updated = restaurants_collection.find_one({"_id": id})
    if updated:
        updated["_id"] = str(updated["_id"])
    return updated

@app.delete("/api/restaurants/{id}")
def delete_restaurant(id: str):
    res = restaurants_collection.delete_one({"_id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    foods_collection.delete_many({"restaurant_id": id})
    return {"message": "Restaurant and associated food items deleted successfully"}


# ================= FOOD ENDPOINTS =================

@app.get("/api/foods")
def get_foods(restaurant_id: Optional[str] = Query(None), category: Optional[str] = Query(None)):
    query = {}
    if restaurant_id:
        query["restaurant_id"] = restaurant_id
    if category and category != "All":
        query["category"] = category

    items = list(foods_collection.find(query))
    for item in items:
        item["_id"] = str(item["_id"])
    return items

@app.get("/api/foods/{id}")
def get_food(id: str):
    item = foods_collection.find_one({"_id": id})
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")
    item["_id"] = str(item["_id"])
    return item

@app.post("/api/foods", status_code=status.HTTP_201_CREATED)
def create_food(food: FoodCreate):
    doc = food.model_dump()
    doc["_id"] = str(ObjectId())
    foods_collection.insert_one(doc)
    return doc

@app.put("/api/foods/{id}")
def update_food(id: str, food: FoodUpdate):
    update_data = {k: v for k, v in food.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = foods_collection.update_one({"_id": id}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Food item not found")

    updated = foods_collection.find_one({"_id": id})
    if updated:
        updated["_id"] = str(updated["_id"])
    return updated

@app.delete("/api/foods/{id}")
def delete_food(id: str):
    res = foods_collection.delete_one({"_id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Food item not found")
    return {"message": "Food item deleted successfully"}


# ================= ORDER ENDPOINTS =================

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate):
    doc = order.model_dump()
    doc["_id"] = str(ObjectId())
    doc["status"] = "Pending"
    doc["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if not doc.get("restaurant_name") or doc.get("restaurant_name") == "TOMOTO Restaurant":
        rest = restaurants_collection.find_one({"_id": doc["restaurant_id"]})
        if rest:
            doc["restaurant_name"] = rest.get("name", "TOMOTO Restaurant")

    orders_collection.insert_one(doc)
    return doc

@app.get("/api/orders")
def get_orders(phone: Optional[str] = Query(None)):
    query = {}
    if phone:
        query["phone"] = phone

    items = list(orders_collection.find(query).sort("_id", -1))
    for item in items:
        item["_id"] = str(item["_id"])
    return items

@app.get("/api/orders/{id}")
def get_order(id: str):
    item = orders_collection.find_one({"_id": id})
    if not item:
        raise HTTPException(status_code=404, detail="Order not found")
    item["_id"] = str(item["_id"])
    return item

@app.put("/api/orders/{id}/status")
def update_order_status(id: str, status_payload: OrderStatusUpdate):
    new_status = status_payload.status
    allowed_statuses = ["Pending", "Confirmed", "Preparing", "Delivered", "Cancelled"]
    if new_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {allowed_statuses}")

    res = orders_collection.update_one({"_id": id}, {"$set": {"status": new_status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")

    updated = orders_collection.find_one({"_id": id})
    if updated:
        updated["_id"] = str(updated["_id"])
    return updated


# ================= USER ENDPOINTS =================

@app.post("/api/users", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    doc = user.model_dump()
    existing = users_collection.find_one({"phone": doc["phone"]})
    if existing:
        existing["_id"] = str(existing["_id"])
        return existing

    doc["_id"] = str(ObjectId())
    users_collection.insert_one(doc)
    return doc

@app.get("/api/users")
def get_users():
    items = list(users_collection.find())
    for item in items:
        item["_id"] = str(item["_id"])
    return items
