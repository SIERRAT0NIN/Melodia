from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import MetaData
from flask_migrate import Migrate
from app_config import db 
from sqlalchemy import MetaData
from sqlalchemy import Column, String, Integer
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class Album(db.Model):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    track_list = db.Column(db.String)
    released_date= db.Column(db.DateTime)
    image = db.Column(db.String)
    public = db.Column(db.Boolean)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    
    # Relationship with Artist
    artist = db.relationship('Artist', backref='albums_relationship')

    # Relationship with Liked_Song
    liked_songs = db.relationship('Liked_Song', backref='album')
    
    def __repr__(self):
        return f'<Album {self.id, self.name, self.released_date, self.public}>'
class AlbumSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Album


class Artist(db.Model):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    bio = db.Column(db.String)
    stats = db.Column(db.Integer)

    # Relationship with Track
    tracks = db.relationship('Track', backref='artist_tracks', foreign_keys='Track.artist_id')

    # Relationship with Album
    albums = db.relationship('Album', backref='artist_albums')

    def __repr__(self):
        return f'<Artist {self.id, self.name, self.bio, self.stats }>'
class ArtistSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Artist

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

    # Relationship with Artist
    artist = db.relationship('Artist', backref='track_artist', foreign_keys=[artist_id])

    # Relationship with Album
    album = db.relationship('Album', backref='tracks', foreign_keys=[album_id])

    # Relationship with Liked_Song
    liked_songs = db.relationship('Liked_Song', backref='track_liked_songs')

    def __repr__(self):
        return f'<Track {self.id, self.title, self.description, self.image, self.stats, self.liked}>'
class Track_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model = Track

class Liked_Song(db.Model):
    __tablename__ = 'liked_songs'

    id = db.Column(db.String, primary_key=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'))
    liked = db.Column(db.Boolean)

    # Relationship with Track
    track = db.relationship('Track', backref='liked_song_track')

    # Relationship with User
    user = db.relationship('User', backref='liked_song_user')

    def __repr__(self):
        return f'<Liked_Song {self.id}>'
class Liked_Song_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model = Liked_Song

class Playlist_Track(db.Model):
    __tablename__ = 'playlist_tracks'
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    playlist_id = db.Column(db.String, db.ForeignKey('playlists.id'))

    # Relationship with Track
    track = db.relationship('Track', backref='_playlist_tracks')
    
    # Relationship with Playlist
    playlist = db.relationship('Playlist', backref='playlist_t')

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

    # Relationship with Track
    track = db.relationship('Track', backref='track_playlists')

    # Relationship with User
    user = db.relationship('User', backref='user_playlists')

    # Relationship with Playlist_Track
    playlist_tracks = db.relationship('Playlist_Track', backref='playlist_playlist_track')

    # Add serialization rules
    serialize_only = ('id','name','description','track_id','user_id','created_at','public')
    
    def __repr__(self):
        return f'<Playlist {self.id}>'
class PlaylistSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Playlist

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    profile_pic = db.Column(db.String)

    # Relationship with Liked_Song
    liked_songs = db.relationship('Liked_Song', backref='user_liked')
    
    # Relationship with Playlist
    playlists = db.relationship('Playlist', backref='user_playlist')

    def __repr__(self):
        return f'<User {self.id, self.name, self.username}>'
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User



