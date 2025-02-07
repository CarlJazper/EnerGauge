from flask import request, jsonify
import pandas as pd
from models.model import load_model, preprocess_data

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

    required_columns = ['month', 'weekday', 'temperature', 'is_holiday', 'day_of_year']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        return jsonify({"error": f"Missing required columns: {', '.join(missing_columns)}"}), 400

    X_scaled = preprocess_data(df, scaler)
    prediction = model.predict(X_scaled)

    df['predicted_consumption'] = prediction
    return jsonify(df.to_dict(orient='records'))
