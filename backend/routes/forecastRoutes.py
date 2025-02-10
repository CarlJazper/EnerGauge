from flask import Blueprint
from controllers.forecastController import train_arima, predict_energy, get_forecast_trends


forecast_bp = Blueprint("forecast", __name__)

forecast_bp.route('/train_arima', methods=['POST'])(train_arima)
forecast_bp.route('/predict_energy', methods=['GET'])(predict_energy)
forecast_bp.route('/trends', methods=['GET'])(get_forecast_trends)