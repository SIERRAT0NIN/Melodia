
from app_config import db
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime


class Token(db.Model):
    __tablename__ = 'tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    access_token = db.Column(db.String, nullable=False, unique=True)
    refresh_token = db.Column(db.String, nullable=False, unique=True)
    access_token_expires_at = db.Column(db.DateTime)
    refresh_token_expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    profile_pic = db.Column(db.String)

    tokens = db.relationship('Token', backref='user', lazy='dynamic')
    song_baskets = db.relationship('SongBasket', back_populates='user', lazy='dynamic')


class Song(db.Model):
    __tablename__ = 'songs'
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.String)
    track_name = db.Column(db.String)
    track_image = db.Column(db.String)
    track_album = db.Column(db.String)
    track_artist = db.Column(db.String)
    track_uri = db.Column(db.String)
    basket_id = db.Column(db.Integer, db.ForeignKey('song_baskets.basket_id'))  

    def to_dict(self):
        return {
            'id': self.id,
            'track_id': self.track_id,
            'track_name': self.track_name,
            'track_image': self.track_image,
            'track_artist': self.track_artist,
            'track_uri': self.track_uri
        }
    baskets = db.relationship('SongBasket', secondary='song_basket_association', back_populates='songs', lazy='dynamic')


class SongBasket(db.Model):
    __tablename__ = 'song_baskets'
    basket_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'))
    playlist_name = db.Column(db.String)
    playlist_description = db.Column(db.String)
    playlist_img = db.Column(db.String)

    user = db.relationship('User', back_populates='song_baskets')
    songs = db.relationship('Song', secondary='song_basket_association', back_populates='baskets', lazy='dynamic')
    def to_dict(self):
        return {
            'basket_id': self.basket_id,
            'user_id': self.user_id,
            'playlist_name': self.playlist_name,
            'playlist_description': self.playlist_description,
            'playlist_img': self.playlist_img
        }


song_basket_association = db.Table('song_basket_association',
    db.Column('song_id', db.Integer, db.ForeignKey('songs.id'), primary_key=True),
    db.Column('basket_id', db.Integer, db.ForeignKey('song_baskets.basket_id'), primary_key=True)
)


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User

class SongBasketSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SongBasket

class SongSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Song
