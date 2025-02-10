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

@token_required  
def train_arima():
    if g.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Error reading file: {str(e)}"}), 400

    required_columns = [
        "Timestamp", "Temperature", "Humidity", "SquareFootage", "Occupancy",
        "HVACUsage", "LightingUsage", "RenewableEnergy", "DayOfWeek",
        "Holiday", "EnergyConsumption"
    ]
    
    if not all(col in df.columns for col in required_columns):
        return jsonify({"error": "CSV must contain required energy forecasting columns"}), 400
    
    df["Timestamp"] = pd.to_datetime(df["Timestamp"])
    df.set_index("Timestamp", inplace=True)
    df = df.sort_index()
    
    # Convert categorical columns
    df["HVACUsage"] = df["HVACUsage"].map({"On": 1, "Off": 0})
    df["LightingUsage"] = df["LightingUsage"].map({"On": 1, "Off": 0})
    df["Holiday"] = df["Holiday"].map({"Yes": 1, "No": 0})
    df["DayOfWeek"] = pd.Categorical(df["DayOfWeek"]).codes  # Convert to numerical

    # Scale features
    feature_cols = ["Temperature", "Humidity", "SquareFootage", "Occupancy",
                    "HVACUsage", "LightingUsage", "RenewableEnergy", "DayOfWeek", "Holiday"]
    
    scaler = MinMaxScaler()
    df[feature_cols] = scaler.fit_transform(df[feature_cols])

    # Train ARIMA model on EnergyConsumption
    model = ARIMA(df["EnergyConsumption"], order=(5,1,0))
    fitted_model = model.fit()

    save_model(fitted_model, scaler)
    
    return jsonify({"message": "ARIMA model trained successfully on energy data."})
  
@token_required  
def predict_energy():
    model, scaler = load_model()
    if model is None:
        return jsonify({"error": "No trained model found."}), 400

    days = int(request.args.get("days", 7))  

    # Forecast energy consumption for given days
    forecast = model.forecast(steps=days)
    forecast = scaler.inverse_transform(np.array(forecast).reshape(-1, 1) * np.ones((1, scaler.n_features_in_))).flatten()

    # Fix for RenewableEnergy inverse transform issue
    sample_input = np.zeros((1, scaler.n_features_in_))  # Create a dummy input with 9 features
    sample_input[0, 6] = 0.5  # Assuming 'RenewableEnergy' is the 7th feature (index 6)
    
    avg_renewable = np.mean(scaler.inverse_transform(sample_input)[:, 6])  # Extract RenewableEnergy value

    # Calculate estimated energy savings
    energy_savings = forecast * (avg_renewable / 100)

    # Peak load prediction (max forecasted energy consumption)
    peak_load = max(forecast)

    # Save forecast results
    forecast_entry = {
        "user_id": ObjectId(g.user_id),
        "timestamp": datetime.datetime.utcnow(),
        "days": days,
        "forecast_energy": list(map(lambda x: round(x, 2), forecast)),
        "energy_savings": list(map(lambda x: round(x, 2), energy_savings)),
        "peak_load": round(peak_load, 2)
    }
    mongo.db.forecasts.insert_one(forecast_entry)

    return jsonify({
        "forecast_energy": forecast_entry["forecast_energy"],
        "energy_savings": forecast_entry["energy_savings"],
        "peak_load": forecast_entry["peak_load"]
    })


@token_required
def get_forecast_trends():
    """Fetch all forecast history for the admin dashboard."""
    if g.role != "admin":  # Ensure only admins can view trends
        return jsonify({"error": "Unauthorized"}), 403

    forecasts = list(mongo.db.forecasts.find({}, {"_id": 1, "user_id": 1, "timestamp": 1, "forecast_energy": 1, "peak_load": 1}))

    # Convert ObjectId to string and ensure proper formatting
    for forecast in forecasts:
        forecast["_id"] = str(forecast["_id"])
        forecast["user_id"] = str(forecast["user_id"])
        
        # Format timestamp properly
        if "timestamp" in forecast and forecast["timestamp"]:
            forecast["timestamp"] = forecast["timestamp"].isoformat()
        else:
            forecast["timestamp"] = None  # Handle missing timestamps

        # Ensure forecast_energy is a sum instead of an array
        if "forecast_energy" in forecast and isinstance(forecast["forecast_energy"], list):
            forecast["total_forecast_energy"] = round(sum(forecast["forecast_energy"]), 2)
        else:
            forecast["total_forecast_energy"] = 0  # Default value

        # Ensure peak_load is handled properly
        forecast["peak_load"] = round(forecast.get("peak_load", 0), 2)

    return jsonify(forecasts)
