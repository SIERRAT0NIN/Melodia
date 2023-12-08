from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import MetaData
import os
from app_config import db
# from models.user import User, UserSchema
# from models.user import UserSchema

from all_models import *
# Import User model before Liked_Song model
# from models.user import User, 
# from models.liked_songs import Liked_Song
# from models.playlist import Playlist
# from models.playlist_track import Playlist_Track
# from models.artist import Artist
# from models.album import Album


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

migrate = Migrate(app, db)
db.init_app(app)

api=Api(app)

class HomePage(Resource):
    def get(self):
        return 'Hello, World!'

    @staticmethod
    def get_user(user_id):
        user = User.query.get_or_404(user_id)
        user_schema = UserSchema()
        user_data = user_schema.dump(user)
        return user_data
api.add_resource(HomePage, '/', endpoint='home_page')
api.add_resource(HomePage, '/user/<int:user_id>', endpoint='get_user')



if __name__ == '__main__':
    app.run(debug=True, port=5556)


