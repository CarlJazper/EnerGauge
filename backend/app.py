from flask import Flask
from flask_cors import CORS
from routes.predictionRoutes import prediction_bp
from routes.trainingRoutes import training_bp
from routes.userRoutes import user_bp
from config.db import init_app

app = Flask(__name__)
CORS(app)

# Initialize DB
init_app(app)

app.register_blueprint(prediction_bp)
app.register_blueprint(training_bp)
# Register routes
app.register_blueprint(user_bp, url_prefix='/api/users')

if __name__ == "__main__":
    app.run(debug=True)
