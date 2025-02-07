from flask import Flask
from flask_cors import CORS
from routes.predictionRoutes import prediction_bp
from routes.trainingRoutes import training_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(prediction_bp)
app.register_blueprint(training_bp)

if __name__ == "__main__":
    app.run(debug=True)
