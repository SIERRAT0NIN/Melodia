from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager
import os
from datetime import timedelta
import spotipy


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"  # Consider using a more robust DB for production
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_NAME"] = "Spotify Cookie"
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'default-secret')  # Use environment variable for production
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

# Initialize JWT
jwt = JWTManager(app)

# Setup CORS if needed
CORS(app)

# Database and migration setup
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
sp = spotipy.Spotify()
