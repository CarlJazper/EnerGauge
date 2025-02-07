from flask import Blueprint
from controllers.trainingController import train

training_bp = Blueprint("training", __name__)

training_bp.route("/train", methods=["POST"])(train)
