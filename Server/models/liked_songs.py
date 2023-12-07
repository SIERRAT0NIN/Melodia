from app_config import db, SerializerMixin 
from sqlalchemy import Column, Integer, String 

class Liked_Song(db.Model, SerializerMixin):
    __tablename__ = 'liked_songs'
    
    track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    album_id= db.Column(db.Integer, db.ForeignKey('albums.id'))
    liked = db.Column(db.Boolean)
    
    #relationship
    track = db.relationship('Track', backref='liked_songs')

    # add serialization rules
    
    def __repr__(self):
        return f'<Liked_Song {self.id}>'