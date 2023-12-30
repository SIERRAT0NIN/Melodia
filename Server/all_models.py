from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import MetaData
from flask_migrate import Migrate
from app_config import db 
from sqlalchemy import MetaData, create_engine, Column, String
from sqlalchemy import Column, String, Integer
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime



from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
# JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')  









class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    email = db.Column(db.String)
    profile_pic = db.Column(db.String)
    password = db.Column(db.String)
    jwt = db.Column(db.String)
    
    def verify_refresh_token(self, refresh_token_to_be_checked):
        return self.refresh_token == refresh_token_to_be_checked
    
    def __repr__(self):
        return f'<User {self.id, self.name, self.username}>'
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        
# class RefreshToken(db.Model):
#     __tablename__ = 'refresh_tokens'
#     user_id = db.Column(db.String, primary_key=True)
#     refresh_token = db.Column(db.String, nullable=False)


# class UserToken(db.Model):
#     __tablename__ = 'user_tokens'

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, nullable=False, unique=True)
#     access_token = db.Column(db.String(255), nullable=False)
#     refresh_token = db.Column(db.String(255), nullable=True)
#     expires_at = db.Column(db.DateTime, nullable=False)

#     def __init__(self, user_id, access_token, refresh_token, expires_at):
#         self.user_id = user_id
#         self.access_token = access_token
#         self.refresh_token = refresh_token
#         self.expires_at = expires_at

#     def __repr__(self):
#         return f'<UserToken {self.user_id}>'


#     def is_token_expired(self):
#         return datetime.utcnow() > self.expires_at
        
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


class Liked_Song(db.Model):
    __tablename__ = 'liked_songs'
    id = db.Column(db.String, primary_key=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'))
    liked = db.Column(db.Boolean)
    def __repr__(self):
        return f'<Liked_Song {self.id}>'
class Liked_Song_Schema(SQLAlchemyAutoSchema):
    
    class Meta:
        model = Liked_Song

class Artist(db.Model):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    bio = db.Column(db.String)
    stats = db.Column(db.Integer)
    def __repr__(self):
        return f'<Artist {self.id, self.name, self.bio, self.stats }>'
class ArtistSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Artist
        
class Album(db.Model):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    track_list = db.Column(db.String)
    released_date = db.Column(db.DateTime)
    image = db.Column(db.String)
    public = db.Column(db.Boolean)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))

    def __repr__(self):
        return f'<Album {self.id, self.name, self.released_date, self.public}>'
class AlbumSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Album

class Track(db.Model):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    image = db.Column(db.Integer)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'))
    stats = db.Column(db.String)
    liked = db.Column(db.Boolean)

    def __repr__(self):
        return f'<Track {self.id, self.title, self.description, self.image, self.stats, self.liked}>'
class Track_Schema(SQLAlchemyAutoSchema):

    class Meta:
        model = Track

class Playlist_Track(db.Model):
    __tablename__ = 'playlist_tracks'
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    playlist_id = db.Column(db.String, db.ForeignKey('playlists.id'))
    def __repr__(self):
        return f'<Playlist_Track {self.track_id, self.playlist_id}>'

class Playlist(db.Model):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime)
    public = db.Column(db.Boolean)

    def __repr__(self):
        return f'<Playlist {self.id}>'
class PlaylistSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Playlist
        

def save_to_database(user_id, refresh_token):
    # Check if a token already exists for the user
    existing_token = RefreshToken.query.filter_by(user_id=user_id).first()
    
    if existing_token:
        # Update the existing token
        existing_token.refresh_token = refresh_token
    else:
        # Create a new token record
        new_token = RefreshToken()
        new_token.user_id = user_id
        new_token.refresh_token = refresh_token
        db.session.add(new_token)

    # Commit the session
    db.session.commit()




#Many to many-- Many baskets can have many songs and many songs can belong to many baskets.
class SongBasket(db.Model):
    __tablename__ = 'song_baskets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'))
    track_id =db.Column(db.String)
    track_name=db.Column(db.String)
    track_image=db.Column(db.String)
    track_album=db.Column(db.String)
    track_artist=db.Column(db.String)
    
    def __repr__(self):
        return f'<SongBasket {self.id}>'
    
class SongBasketSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SongBasket
        

#Relationships


track = db.relationship('Track', back_populates='liked_songs', foreign_keys='[Liked_Song.track_id]')
user = db.relationship('User', backref='liked_songs')



tracks = db.relationship('Track', back_populates='artist', foreign_keys='[Track.artist_id]')
albums = db.relationship('Album', back_populates='artist', foreign_keys='[Album.artist_id]')


artist = db.relationship('Artist', back_populates='albums', foreign_keys='[Album.artist_id]')
liked_songs = db.relationship('Liked_Song', back_populates='album')


artist = db.relationship('Artist', back_populates='tracks', foreign_keys='[Track.artist_id]')
album = db.relationship('Album', back_populates='tracks', foreign_keys='[Track.album_id]')
liked_songs = db.relationship('Liked_Song', back_populates='track')


tracks = db.relationship('Track', secondary='playlist_tracks', back_populates='playlists')
playlists = db.relationship('Playlist', secondary='playlist_tracks', back_populates='tracks')






# Liked_Song.track = db.relationship('Track', backref='liked_song_track', foreign_keys='[Liked_Song.track_id]')
# Liked_Song.user = db.relationship('User', backref='liked_song_user')


# Album.artist = db.relationship('Artist', backref='albums_relationship', foreign_keys='[Album.artist_id]')
# Album.liked_songs = db.relationship('Liked_Song', backref='album')



# Artist.tracks = db.relationship('Track', backref='artist_tracks', foreign_keys='[Track.artist_id]')
# Artist.albums = db.relationship('Album', backref='artist_albums')


# Track.artist = db.relationship('Artist', backref='track_artist', foreign_keys='[Track.artist_id]')
# Track.album = db.relationship('Album', backref='tracks', foreign_keys='[Track.album_id]')
# Track.liked_songs = db.relationship('Liked_Song', backref='track_liked_songs')


# Playlist.track = db.relationship('Track', backref='track_playlists')
# Playlist.user = db.relationship('User', backref='user_playlists')
# Playlist.playlist_tracks = db.relationship('Playlist_Track', backref='playlist_playlist_track')