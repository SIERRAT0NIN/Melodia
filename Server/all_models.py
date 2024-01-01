from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_migrate import Migrate
from app_config import db 
from sqlalchemy import MetaData, create_engine, Column, String
from sqlalchemy import Column, String, Integer, Table, ForeignKey
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


import os

song_basket_association = db.Table('song_basket_association',
    db.Column('song_id', db.String, db.ForeignKey('songs.id'), primary_key=True),
    db.Column('basket_id', db.Integer, db.ForeignKey('song_baskets.basket_id'), primary_key=True)
)
class Token(db.Model):
    __tablename__ = 'tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    access_token = db.Column(db.String, nullable=False, unique=True)
    refresh_token = db.Column(db.String, nullable=False, unique=True)
    access_token_expires_at = db.Column(db.DateTime)
    refresh_token_expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Token user_id={self.user_id}>'
    
class Song_Basket(db.Model):
    __tablename__ = 'song_baskets'
    
    basket_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'))
    # track_id = db.Column(db.String, db.ForeignKey('songs.track_id'))
    def __repr__(self):
        return f'<Song_Basket {self.id}>'


class Song(db.Model):
    __tablename__ = 'songs'
    
    id = db.Column(db.Integer, primary_key=True)
    track_id =db.Column(db.String)
    track_name=db.Column(db.String)
    track_image=db.Column(db.String)
    track_album=db.Column(db.String)
    track_artist=db.Column(db.String)
    basket_id=db.Column(db.Integer)
    # song_basket_id=db.Column(db.Integer, db.ForeignKey('song_baskets.id'))

    baskets = relationship('Song_Basket', secondary=song_basket_association, backref=db.backref('songs', lazy='dynamic'))

    def __repr__(self):
        return f'<Song {self.id}>'
    
class SongSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Song
        
        
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    profile_pic = db.Column(db.String)
    password = db.Column(db.String)
    # songs = relationship('Song', secondary=user_songs, backref=db.backref('users', lazy='dynamic'))
    
    
    tokens = relationship('Token', backref='user', lazy=True)
    song_baskets = relationship('Song_Basket', backref='user', lazy=True)


    def verify_refresh_token(self, refresh_token_to_be_checked):
        return self.refresh_token == refresh_token_to_be_checked
    
    def __repr__(self):
        return f'<User {self.id, self.name, self.username}>'
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        

        

#Many to many-- Many baskets can have many songs and many songs can belong to many baskets.


