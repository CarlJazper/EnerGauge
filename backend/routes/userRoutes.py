from flask import Blueprint, jsonify
from controllers.userController import register_user, login_user, get_user_profile,update_user_profile
from middlewares.authMiddleware import token_required

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/register', methods=['POST'])(register_user)
user_bp.route('/login', methods=['POST'])(login_user)
user_bp.route('/profile', methods=['GET'])(get_user_profile)
user_bp.route('/profile', methods=['PUT'])(update_user_profile)
