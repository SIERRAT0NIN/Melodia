from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import MetaData
from flask_migrate import Migrate
from Server.app import db

class Playlist_Track(db.Model):
    __tablename__ = 'playlist_tracks'

    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    playlist_id = db.Column(db.String, db.ForeignKey('playlists.id'))

    #relationship
    track = db.relationship('Track', backref='playlist_tracks')
    playlist = db.relationship('Playlist', backref='playlist_tracks')

    # add serialization rules
    
    def __repr__(self):
        return f'<Playlist_Track {self.track_id, self.playlist_id}>'