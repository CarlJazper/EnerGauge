import os
import jwt
import datetime
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from config.db import mongo
from models.userModel import get_user_schema
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 60))

def generate_jwt(user_id,role):
    """Generate JWT token"""
    payload = {
        "user_id": str(user_id),
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRATION_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def register_user():
    data = request.get_json()
    user_data = get_user_schema()

    # Validate required fields
    for field in ['first_name', 'last_name', 'email', 'password']:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    # Check if user already exists
    existing_user = mongo.db.users.find_one({"email": data['email']})
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    # Hash password
    hashed_password = generate_password_hash(data['password'])

    # Prepare user data
    user_data.update({
        "first_name": data['first_name'],
        "last_name": data['last_name'],
        "address": data.get('address', ''),
        "city": data.get('city', ''),
        "country": data.get('country', ''),
        "email": data['email'],
        "password": hashed_password
    })

    # Insert user into database
    inserted_user = mongo.db.users.insert_one(user_data)
    # After registering or logging in the user, get the role and generate the JWT token
    role = user_data.get('role', 'user')  # Default to 'user' if role is not set
    token = generate_jwt(inserted_user.inserted_id, role)


    return jsonify({"message": "User registered successfully", "token": token}), 201

def login_user():
    data = request.get_json()

    # Validate required fields
    if 'email' not in data or 'password' not in data:
        return jsonify({"message": "Email and password are required"}), 400

    # Check if user exists
    user = mongo.db.users.find_one({"email": data['email']})
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Verify password
    if not check_password_hash(user['password'], data['password']):
        return jsonify({"message": "Incorrect password"}), 400
    
    role = user.get('role')
    # Generate JWT token
    token = generate_jwt(user["_id"], role)

    return jsonify({"message": "Login successful", "token": token}), 200
