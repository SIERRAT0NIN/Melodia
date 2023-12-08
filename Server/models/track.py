# from flask_sqlalchemy import SQLAlchemy

# from flask import Flask
# from sqlalchemy import MetaData
# from flask_migrate import Migrate
# from project_app import db


# class Track(db.Model):
#     __tablename__ = 'tracks'

#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String)
#     description = db.Column(db.String)
#     image = db.Column(db.Integer)
#     artist_id = db.Column(db.Integer)
#     album_id = db.Column(db.Integer)
#     stats = db.Column(db.String)
#     liked = db.Column(db.Boolean)
    
#     #relationship
#     artist = db.relationship('Artist', backref='tracks', foreign_keys=[artist_id])

#     # Relationship with Album
#     album = db.relationship('Album', backref='tracks', foreign_keys=[album_id])

#     # Relationship with Liked_Song
#     liked_songs = db.relationship('Liked_Song', backref='track')
#     # add serialization rules
    
#     def __repr__(self):
#         return f'<Track{self.id,self.title,self.description,self.image,self.stats,self.liked}>'