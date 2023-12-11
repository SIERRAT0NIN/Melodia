from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import MetaData
from flask_migrate import Migrate
from Server.app import db

class Artist(db.Model):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    bio = db.Column(db.String)
    stats = db.Column(db.Integer)

    albums = db.relationship('Album', backref='artist')

    # Relationship with Track
    tracks = db.relationship('Track', backref='artist', foreign_keys=['Track.artist_id'])

    
    def __repr__(self):
        return f'<Artist {self.id, self.name, self.bio, self.stats }>'
    
class Album(db.Model):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    track_list = db.Column(db.String)
    released_date= db.Column(db.DateTime)
    image = db.Column(db.String)
    public = db.Column(db.Boolean)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))

    def __repr__(self):
        return f'<Album {self.id, self.name, self.released_date, self.public}>'

class Track(db.Model):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    image = db.Column(db.Integer)
    artist_id = db.Column(db.Integer)
    album_id = db.Column(db.Integer)
    stats = db.Column(db.String)
    liked = db.Column(db.Boolean)

    # Relationship with Artist
    artist = db.relationship('Artist', backref='tracks', foreign_keys=[artist_id])

    # Relationship with Album
    album = db.relationship('Album', backref='tracks', foreign_keys=[album_id])

    # Relationship with Liked_Song
    liked_songs = db.relationship('Liked_Song', backref='track')

    def __repr__(self):
        return f'<Track {self.id, self.title, self.description, self.image, self.stats, self.liked}>'
class Liked_Song(db.Model):
    __tablename__ = 'liked_songs'

    id = db.Column(db.String, primary_key=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'))
    liked = db.Column(db.Boolean)

    # Relationship with Track
    track = db.relationship('Track', backref='liked_songs')

    # Relationship with User
    user = db.relationship('User', backref='liked_songs')

    def __repr__(self):
        return f'<Liked_Song {self.id}>'