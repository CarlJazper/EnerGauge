from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np  # Add this import if not already there
from statsmodels.tsa.arima.model import ARIMA
from sklearn.preprocessing import MinMaxScaler  # Added for scaling
from models.forecastModel import save_model, load_model

forecast_bp = Blueprint('forecast', __name__)

def train_arima():
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
    
    # Scale the 'Demand' values (Optional, using MinMaxScaler here)
    scaler = MinMaxScaler(feature_range=(0, 1))
    df["Scaled_Demand"] = scaler.fit_transform(df["Demand"].values.reshape(-1, 1))
    
    # Train ARIMA model
    model = ARIMA(df["Demand"], order=(5,1,0))
    fitted_model = model.fit()
    
    # Save the ARIMA model and scaler
    save_model(fitted_model, scaler)
    
    return jsonify({"message": "ARIMA model trained successfully."})



def predict_demand():
    model, scaler = load_model()
    if model is None:
        return jsonify({"error": "No trained model found."}), 400

    days = int(request.args.get("days", 7))  # Default to 7 days forecast
    forecast = model.forecast(steps=days)
    
    # Convert forecast to numpy array and reverse the scaling
    forecast = scaler.inverse_transform(np.array(forecast).reshape(-1, 1)).flatten()  # Reshape to invert scaling
    
    predictions = {f"Day {i+1}": round(pred, 2) for i, pred in enumerate(forecast)}
    return jsonify({"predictions": predictions})