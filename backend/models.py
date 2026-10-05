from pydantic import BaseModel, Field
from typing import List, Optional

# User Models
class UserCreate(BaseModel):
    name: str
    phone: str
    email: str

class UserResponse(UserCreate):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

# Restaurant Models
class RestaurantCreate(BaseModel):
    name: str
    cuisine: str
    description: str
    rating: float = 4.5
    delivery_time: str = "30-40 min"
    image: str

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    cuisine: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    delivery_time: Optional[str] = None
    image: Optional[str] = None

class RestaurantResponse(RestaurantCreate):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

# Food Models
class FoodCreate(BaseModel):
    restaurant_id: str
    name: str
    description: str
    category: str
    price: float
    image: str
    available: bool = True

class FoodUpdate(BaseModel):
    restaurant_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    available: Optional[bool] = None

class FoodResponse(FoodCreate):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

# Order Models (Demonstrating NoSQL nested documents & arrays)
class OrderItem(BaseModel):
    food_name: str
    quantity: int
    price: float

class DeliveryAddress(BaseModel):
    address: str
    city: str
    pincode: str

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    restaurant_id: str
    restaurant_name: Optional[str] = "TOMOTO Restaurant"
    items: List[OrderItem]
    delivery_address: DeliveryAddress
    total_amount: float
    payment_method: str = "Cash on Delivery"

class OrderStatusUpdate(BaseModel):
    status: str  # Pending, Confirmed, Preparing, Delivered

class OrderResponse(OrderCreate):
    id: str = Field(alias="_id")
    status: str = "Pending"
    created_at: str

    class Config:
        populate_by_name = True
