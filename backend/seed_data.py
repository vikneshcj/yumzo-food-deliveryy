import datetime
from bson import ObjectId
from database import restaurants_collection, foods_collection, users_collection, orders_collection

def seed_database(force: bool = False):
    if force:
        restaurants_collection.delete_many({})
        foods_collection.delete_many({})
        users_collection.delete_many({})
        orders_collection.delete_many({})

    # Only seed if restaurants collection is empty
    if restaurants_collection.count_documents({}) > 0:
        print("Database already contains data. Skipping seeding.")
        return

    print("Seeding MongoDB collections with YUMZO sample data...")

    # 1. Sample Users
    users_data = [
        {"_id": str(ObjectId()), "name": "Rahul Kumar", "phone": "9876543210", "email": "rahul@gmail.com"},
        {"_id": str(ObjectId()), "name": "Priya Sharma", "phone": "9123456789", "email": "priya@gmail.com"},
        {"_id": str(ObjectId()), "name": "Amit Verma", "phone": "9988776655", "email": "amit@gmail.com"}
    ]
    users_collection.insert_many(users_data)

    # 2. Sample Restaurants
    # Ordering:
    # 1. Magnolia Bakery (Replaces Spice Garden)
    # 2. Bengaluru Biryani House
    # 3. Milano Ice Creams (In place of Dosa Corner)
    # 4. Pizza Point
    # 5. Dosa Corner (In place of Milano Ice Creams / Chinese Wok)
    restaurants_data = [
        {
            "_id": str(ObjectId()),
            "name": "Magnolia Bakery",
            "cuisine": "Bakery & Gourmet Desserts",
            "description": "World-famous bakery serving signature cupcakes, puddings, and decadent chocolate cakes",
            "rating": 4.9,
            "delivery_time": "20-30 min",
            "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
        },
        {
            "_id": str(ObjectId()),
            "name": "Bengaluru Biryani House",
            "cuisine": "Biryani & South Indian",
            "description": "Famous Hyderabadi & Donne Biryani cooked with fragrant spices",
            "rating": 4.8,
            "delivery_time": "25-35 min",
            "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
        },
        {
            "_id": str(ObjectId()),
            "name": "Milano Ice Creams",
            "cuisine": "Artisanal Ice Creams & Gelato",
            "description": "Authentic Italian gelato, gourmet scoops, dark chocolate sundaes and refreshing sorbets",
            "rating": 4.9,
            "delivery_time": "15-25 min",
            "image": "https://images.unsplash.com/photo-1567206563064-6f60f4078b57?auto=format&fit=crop&w=600&q=80"
        },
        {
            "_id": str(ObjectId()),
            "name": "Pizza Point",
            "cuisine": "Italian & Pizza",
            "description": "Hand-tossed wood-fired pizzas with fresh mozzarella and gourmet toppings",
            "rating": 4.4,
            "delivery_time": "35-45 min",
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
        },
        {
            "_id": str(ObjectId()),
            "name": "Dosa Corner",
            "cuisine": "South Indian Tiffin",
            "description": "Crispy Masala Dosas, Idlis, Medu Vada and authentic Filter Coffee",
            "rating": 4.6,
            "delivery_time": "20-30 min",
            "image": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
        }
    ]
    
    restaurants_collection.insert_many(restaurants_data)
    rest_map = {r["name"]: r["_id"] for r in restaurants_data}

    # 3. Sample Foods (20 items)
    foods_data = [
        # Magnolia Bakery (Top Desserts & Death By Chocolate!)
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Magnolia Bakery"],
            "name": "Death By Chocolate",
            "description": "Triple-layered rich dark chocolate cake topped with hot fudge, truffle rosettes, and chocolate shavings",
            "category": "Desserts",
            "price": 280,
            "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Magnolia Bakery"],
            "name": "Famous Banana Pudding",
            "description": "Layers of vanilla wafers, fresh bananas, and creamy vanilla pudding",
            "category": "Desserts",
            "price": 220,
            "image": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Magnolia Bakery"],
            "name": "Red Velvet Cupcake",
            "description": "Classic red velvet cake topped with rich whipped cream cheese frosting",
            "category": "Desserts",
            "price": 160,
            "image": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Magnolia Bakery"],
            "name": "Chocolate Hazelnut Cheesecake",
            "description": "Creamy baked Nutella cheesecake on a crunchy Oreo cookie crust",
            "category": "Desserts",
            "price": 310,
            "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
            "available": True
        },

        # Biryani
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Bengaluru Biryani House"],
            "name": "Hyderabadi Chicken Biryani",
            "description": "Basmati rice cooked with marinated chicken and aromatic spices",
            "category": "Biryani",
            "price": 280,
            "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Bengaluru Biryani House"],
            "name": "Paneer Dum Biryani",
            "description": "Fragrant saffron rice layered with fresh spiced paneer cubes",
            "category": "Biryani",
            "price": 240,
            "image": "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Bengaluru Biryani House"],
            "name": "Mutton Biryani Special",
            "description": "Tender mutton chunks slow cooked dum style with ghee and spices",
            "category": "Biryani",
            "price": 350,
            "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
            "available": True
        },

        # Milano Ice Creams (Artisanal Gelato & Ice Creams)
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Milano Ice Creams"],
            "name": "Belgian Dark Chocolate Gelato",
            "description": "Rich 70% dark Belgian chocolate scoop drizzled with hot fudge sauce",
            "category": "Ice Creams",
            "price": 170,
            "image": "https://images.unsplash.com/photo-1567206563064-6f60f4078b57?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Milano Ice Creams"],
            "name": "Sicilian Pistachio Scoop",
            "description": "Authentic Italian roasted pistachio gelato made with natural ingredients",
            "category": "Ice Creams",
            "price": 190,
            "image": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Milano Ice Creams"],
            "name": "Alphonso Mango Sorbet",
            "description": "Refreshing dairy-free sorbet crafted from real Ratnagiri Alphonso mangoes",
            "category": "Ice Creams",
            "price": 150,
            "image": "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Milano Ice Creams"],
            "name": "Nutella Ferrero Rocher Sundae",
            "description": "Double scoops of hazelnut gelato topped with crushed Ferrero Rocher & Nutella",
            "category": "Ice Creams",
            "price": 240,
            "image": "https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=600&q=80",
            "available": True
        },

        # Pizza & Italian
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Pizza Point"],
            "name": "Margherita Classic Pizza",
            "description": "Fresh tomato sauce, melted mozzarella cheese, and basil leaves",
            "category": "Pizza",
            "price": 299,
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Pizza Point"],
            "name": "Chicken Feast Supreme",
            "description": "Loaded with grilled chicken, jalapenos, onions, paprika and extra cheese",
            "category": "Pizza",
            "price": 399,
            "image": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Pizza Point"],
            "name": "Crispy Chicken Zinger Burger",
            "description": "Crunchy fried chicken fillet with spicy mayo, lettuce in toasted bun",
            "category": "Burger",
            "price": 180,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Pizza Point"],
            "name": "Classic Veg Cheese Burger",
            "description": "Crispy veg patty topped with melted cheddar cheese slice and herbs",
            "category": "Burger",
            "price": 140,
            "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
            "available": True
        },

        # Dosa Corner
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Dosa Corner"],
            "name": "Butter Masala Dosa",
            "description": "Golden crispy crepe stuffed with spiced potato masala and amul butter",
            "category": "South Indian",
            "price": 110,
            "image": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Dosa Corner"],
            "name": "Steamed Idli (2 Pcs) & Vada",
            "description": "Soft fluffy idlis and crunchy medu vada served with coconut chutney & sambar",
            "category": "South Indian",
            "price": 90,
            "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
            "available": True
        },
        {
            "_id": str(ObjectId()),
            "restaurant_id": rest_map["Dosa Corner"],
            "name": "Onion Rava Dosa",
            "description": "Crispy semolina dosa laced with finely chopped onions and green chillies",
            "category": "South Indian",
            "price": 130,
            "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
            "available": True
        }
    ]
    foods_collection.insert_many(foods_data)

    # 4. Sample Orders
    orders_data = [
        {
            "_id": str(ObjectId()),
            "customer_name": "Rahul Kumar",
            "phone": "9876543210",
            "restaurant_id": rest_map["Magnolia Bakery"],
            "restaurant_name": "Magnolia Bakery",
            "items": [
                {
                    "food_name": "Death By Chocolate",
                    "quantity": 1,
                    "price": 280
                },
                {
                    "food_name": "Famous Banana Pudding",
                    "quantity": 1,
                    "price": 220
                }
            ],
            "delivery_address": {
                "address": "123, 4th Cross, MG Road",
                "city": "Bengaluru",
                "pincode": "560001"
            },
            "total_amount": 500,
            "payment_method": "Cash on Delivery",
            "status": "Confirmed",
            "created_at": (datetime.datetime.now() - datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")
        },
        {
            "_id": str(ObjectId()),
            "customer_name": "Priya Sharma",
            "phone": "9123456789",
            "restaurant_id": rest_map["Milano Ice Creams"],
            "restaurant_name": "Milano Ice Creams",
            "items": [
                {
                    "food_name": "Belgian Dark Chocolate Gelato",
                    "quantity": 2,
                    "price": 170
                },
                {
                    "food_name": "Alphonso Mango Sorbet",
                    "quantity": 1,
                    "price": 150
                }
            ],
            "delivery_address": {
                "address": "Flat 402, Sunshine Apartments, Indiranagar",
                "city": "Bengaluru",
                "pincode": "560038"
            },
            "total_amount": 490,
            "payment_method": "Cash on Delivery",
            "status": "Preparing",
            "created_at": (datetime.datetime.now() - datetime.timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M:%S")
        }
    ]
    orders_collection.insert_many(orders_data)
    print("YUMZO database re-seeding completed successfully!")
