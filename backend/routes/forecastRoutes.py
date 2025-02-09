from flask import Blueprint
from controllers.forecastController import train_arima, predict_demand


forecast_bp = Blueprint("forecast", __name__)

forecast_bp.route('/train_arima', methods=['POST'])(train_arima)
forecast_bp.route('/predict_demand', methods=['GET'])(predict_demand)
