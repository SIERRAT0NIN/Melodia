from app_config import db, SerializerMixin  
from sqlalchemy import Column, Integer, String
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    profile_pic = db.Column(db.String)
    
    #relationship
    liked_songs = db.relationship('Liked_Song', backref='user')
    # add serialization rules
    playlists = db.relationship('Playlist', backref='user')
    
    def __repr__(self):
        return f'<User {self.id, self.name, self.username, self.profile_pic}>'