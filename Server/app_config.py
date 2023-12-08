from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
# from sqlalchemy.orm import validates
# from sqlalchemy.ext.associationproxy import association_proxy
# from sqlalchemy_serializer import SerializerMixin
# from spotipy.oauth2 import SpotifyOAuth
# from models.user import User
# from models.track import Track
# from models.playlist import Playlist
# from models.playlist_track import Playlist_Track
# from models.liked_songs import Liked_Song
# from models.artist import Artist
# from models.album import Album
# import json
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
# migrate = Migrate(app, db)
# db.init_app(app)
# api = Api(app)
# CORS(app)