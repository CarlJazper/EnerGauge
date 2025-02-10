from flask import Blueprint, request, jsonify, g
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.preprocessing import MinMaxScaler
from models.forecastModel import save_model, load_model
from config.db import mongo
from bson import ObjectId
import datetime
from middlewares.authMiddleware import token_required

forecast_bp = Blueprint('forecast', __name__)

@token_required  # Ensure only authenticated users (e.g., admins) can train
def train_arima():
    if g.role != "admin":  # Only allow admins to train the model
        return jsonify({"error": "Unauthorized"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Error reading file: {str(e)}"}), 400
    
    if "Date" not in df.columns or "Demand" not in df.columns:
        return jsonify({"error": "CSV must contain 'Date' and 'Demand' columns"}), 400
    
    df["Date"] = pd.to_datetime(df["Date"])
    df.set_index("Date", inplace=True)
    df = df.sort_index()
    
    # Scale the 'Demand' values
    scaler = MinMaxScaler(feature_range=(0, 1))
    df["Scaled_Demand"] = scaler.fit_transform(df["Demand"].values.reshape(-1, 1))
    
    # Train ARIMA model
    model = ARIMA(df["Demand"], order=(5,1,0))
    fitted_model = model.fit()
    
    # Save the ARIMA model and scaler
    save_model(fitted_model, scaler)
    
    return jsonify({"message": "ARIMA model trained successfully."})

@token_required  # Ensure only authenticated users can predict
def predict_demand():
    model, scaler = load_model()
    if model is None:
        return jsonify({"error": "No trained model found."}), 400

    days = int(request.args.get("days", 7))  # Default to 7 days forecast
    forecast = model.forecast(steps=days)
    
    # Reverse scaling
    forecast = scaler.inverse_transform(np.array(forecast).reshape(-1, 1)).flatten()

    # Save forecast result in MongoDB
    forecast_entry = {
        "user_id": ObjectId(g.user_id),
        "timestamp": datetime.datetime.utcnow(),
        "days": days,
        "forecast": list(map(lambda x: round(x, 2), forecast))
    }
    mongo.db.forecasts.insert_one(forecast_entry)

    return jsonify({"predictions": forecast_entry["forecast"]})


@token_required
def get_forecast_trends():
    """Fetch all forecast history for admin dashboard."""
    if g.role != "admin":  # Ensure only admins can view trends
        return jsonify({"error": "Unauthorized"}), 403

    forecasts = list(mongo.db.forecasts.find({}, {"_id": 0}))  # Fetch all
    return jsonify(forecasts)
