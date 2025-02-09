from flask import request, jsonify
import pandas as pd
from models.model import load_model, preprocess_data
import joblib

def predict():
    model, scaler = load_model()
    if model is None or scaler is None:
        return jsonify({"error": "Model not trained yet"}), 400

    if 'file' in request.files:  # Handle file upload
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        try:
            df = pd.read_csv(file)
        except Exception as e:
            return jsonify({"error": f"Error reading file: {str(e)}"}), 400
    else:
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No input provided"}), 400
            df = pd.DataFrame([data])
        except Exception as e:
            return jsonify({"error": f"Invalid input format: {str(e)}"}), 400

    # Load feature columns used during training
    trained_columns = joblib.load("models/trainedData/columns.pkl")

    # Required columns based on training
    required_columns = [
        "Temperature", "Humidity", "SquareFootage", "Occupancy",
        "HVACUsage", "LightingUsage", "RenewableEnergy",
        "DayOfWeek", "Holiday"
    ]
    
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        return jsonify({"error": f"Missing required columns: {', '.join(missing_columns)}"}), 400

    try:
        X_scaled = preprocess_data(df, scaler)
        prediction = model.predict(X_scaled)
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

    df['predicted_consumption'] = prediction
    return jsonify(df.to_dict(orient='records'))
