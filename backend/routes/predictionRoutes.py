from flask import Blueprint
from controllers.predictionController import predict

prediction_bp = Blueprint("prediction", __name__)

prediction_bp.route("/predict", methods=["POST"])(predict)
