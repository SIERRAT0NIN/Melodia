# from flask_sqlalchemy import SQLAlchemy
# from flask import Flask
# from sqlalchemy import MetaData
# from flask_migrate import Migrate
# from app_config import db

# class Liked_Song(db.Model):
#     __tablename__ = 'liked_songs'
    
#     id = db.Column(db.String, primary_key=True)
#     track_id = db.Column(db.String, db.ForeignKey('tracks.id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     album_id= db.Column(db.Integer, db.ForeignKey('albums.id'))
#     liked = db.Column(db.Boolean)
    

#     # Relationship with Track
#     track = db.relationship('Track', backref='liked_songs')

#     # Relationship with User
#     user = db.relationship('User', backref='liked_songs')

#     # add serialization rules
    
#     def __repr__(self):
#         return f'<Liked_Song {self.id}>'