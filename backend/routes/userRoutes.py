from flask import Blueprint, jsonify
from controllers.userController import register_user, login_user
from middlewares.authMiddleware import token_required

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/register', methods=['POST'])(register_user)
user_bp.route('/login', methods=['POST'])(login_user)
