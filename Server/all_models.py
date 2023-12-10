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

    # Relationship with Liked_Song

    
    # Relationship with Playlist


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
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'))
    liked = db.Column(db.Boolean)

    # Relationship with Track


    # Relationship with User


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

    # Relationship with Track
    # Relationship with Album
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

    # Relationships

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

    # Relationships


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

    # Relationships

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

    # Relationships

    # Add serialization rules
    serialize_only = ('id', 'name', 'description', 'track_id', 'user_id', 'created_at', 'public')

    def __repr__(self):
        return f'<Playlist {self.id}>'

class PlaylistSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Playlist



Liked_Song.track = db.relationship('Track', backref='liked_song_track', foreign_keys='[Liked_Song.track_id]')
Liked_Song.user = db.relationship('User', backref='liked_song_user')

Artist.tracks = db.relationship('Track', backref='artist_tracks', foreign_keys='[Track.artist_id]')
Artist.albums = db.relationship('Album', backref='artist_albums')

Album.artist = db.relationship('Artist', backref='albums_relationship', foreign_keys='[Album.artist_id]')
Album.liked_songs = db.relationship('Liked_Song', backref='album')

Track.artist = db.relationship('Artist', backref='track_artist', foreign_keys='[Track.artist_id]')
Track.album = db.relationship('Album', backref='tracks', foreign_keys='[Track.album_id]')
Track.liked_songs = db.relationship('Liked_Song', backref='track_liked_songs')

Playlist.track = db.relationship('Track', backref='track_playlists')
Playlist.user = db.relationship('User', backref='user_playlists')
Playlist.playlist_tracks = db.relationship('Playlist_Track', backref='playlist_playlist_track')
