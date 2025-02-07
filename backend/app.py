from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = "energy_model.pkl"
SCALER_PATH = "scaler.pkl"

# Load existing model and scaler if available
if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
else:
    model, scaler = None, None


@app.route('/predict', methods=['POST'])
def predict():
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
            data = request.get_json()  # Handle manual input
            if not data:
                return jsonify({"error": "No input provided"}), 400
            df = pd.DataFrame([data])
        except Exception as e:
            return jsonify({"error": f"Invalid input format: {str(e)}"}), 400

    # Ensure required columns exist
    required_columns = ['month', 'weekday', 'temperature', 'is_holiday', 'day_of_year']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        return jsonify({"error": f"Missing required columns: {', '.join(missing_columns)}"}), 400

    # Preprocess & predict
    X = df[required_columns]
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)

    df['predicted_consumption'] = prediction
    result = df.to_dict(orient='records')

    return jsonify(result)


@app.route("/train", methods=["POST"])
def train():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["file"]
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Error reading file: {str(e)}"})

    required_columns = ["month", "weekday", "temperature", "is_holiday", "day_of_year", "energy_consumption"]
    if not all(col in df.columns for col in required_columns):
        return jsonify({"error": "Missing required columns"})

    X = df[["month", "weekday", "temperature", "is_holiday", "day_of_year"]]
    y = df["energy_consumption"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "R2 Score": r2_score(y_test, y_pred),
        "MAE": mean_absolute_error(y_test, y_pred),
        "RMSE": mean_squared_error(y_test, y_pred) ** 0.5,

    }

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    return jsonify({"message": "Model trained successfully", "metrics": metrics})


if __name__ == "__main__":
    app.run(debug=True)