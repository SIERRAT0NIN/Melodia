from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import MetaData
from flask_migrate import Migrate
from app_config import db 
from sqlalchemy import MetaData
from sqlalchemy import Column, String, Integer
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    profile_pic = db.Column(db.String)


    #relationship
    liked_songs = db.relationship('Liked_Song', backref='user')
    playlists = db.relationship('Playlist', backref='user')
    # add serialization rules
    # serialize_only = ('id', 'name', 'username', 'email', 'password', 'profile_pic')
    
    def __repr__(self):
        return f'<User {self.id, self.name, self.username}>'
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User

class Liked_Song(db.Model):
    __tablename__ = 'liked_songs'
    
    id = db.Column(db.String, primary_key=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    album_id= db.Column(db.Integer, db.ForeignKey('albums.id'))
    liked = db.Column(db.Boolean)
    

    # Relationship with Track
    track = db.relationship('Track', backref='liked_songs')

    # Relationship with User
    user = db.relationship('User', backref='liked_songs')

    # add serialization rules
    
    def __repr__(self):
        return f'<Liked_Song {self.id}>'





