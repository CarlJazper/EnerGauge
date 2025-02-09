from flask import request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from models.model import save_model

def train():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Error reading file: {str(e)}"}), 400

    required_columns = [
        "Temperature", "Humidity", "SquareFootage", "Occupancy",
        "HVACUsage", "LightingUsage", "RenewableEnergy",
        "DayOfWeek", "Holiday", "EnergyConsumption"
    ]
    
    if not all(col in df.columns for col in required_columns):
        return jsonify({"error": "Missing required columns"}), 400

    # Convert categorical columns
    df["HVACUsage"] = df["HVACUsage"].map({"On": 1, "Off": 0})
    df["LightingUsage"] = df["LightingUsage"].map({"On": 1, "Off": 0})
    df["Holiday"] = df["Holiday"].map({"Yes": 1, "No": 0})

    # One-hot encode "DayOfWeek"
    df = pd.get_dummies(df, columns=["DayOfWeek"], drop_first=True)

    # Features and Target
    X = df.drop(columns=["EnergyConsumption"])
    y = df["EnergyConsumption"]

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    metrics = {
        "R2 Score": r2_score(y_test, y_pred),
        "MAE": mean_absolute_error(y_test, y_pred),
        "RMSE": mean_squared_error(y_test, y_pred) ** 0.5,
    }

    # Get feature names after one-hot encoding
    trained_columns = list(X.columns)

    # Save model, scaler, and trained columns
    save_model(model, scaler, trained_columns)

    return jsonify({"message": "Model trained successfully", "metrics": metrics})