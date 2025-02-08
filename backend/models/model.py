import os
import joblib

MODEL_PATH = "models/trainedData/energy_model.pkl"
SCALER_PATH = "models/trainedData/scaler.pkl"

# Load existing model and scaler if available
def load_model():
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    else:
        model, scaler = None, None
    return model, scaler

def save_model(model, scaler):
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

def preprocess_data(df, scaler):
    required_columns = ['month', 'weekday', 'temperature', 'is_holiday', 'day_of_year']
    X = df[required_columns]
    X_scaled = scaler.transform(X)
    return X_scaled
