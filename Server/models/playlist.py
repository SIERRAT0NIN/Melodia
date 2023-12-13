from flask_sqlalchemy import SQLAlchemy

from flask import Flask
from sqlalchemy import MetaData
from flask_migrate import Migrate
from Server.app import db

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
    track = db.relationship('Track', backref='playlists')

    # Relationship with User
    user = db.relationship('User', backref='playlists')

    # Relationship with Playlist_Track
    playlist_tracks = db.relationship('Playlist_Track', backref='playlist')
    # add serialization rules
    serialize_only = ('id','name','description','track_id','user_id','created_at','public')
    def __repr__(self):
        return f'<Playlist {self.id}>'