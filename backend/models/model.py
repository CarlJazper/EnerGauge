import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

MODEL_PATH = "models/energy_model.pkl"
SCALER_PATH = "models/scaler.pkl"

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
