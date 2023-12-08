# from flask_sqlalchemy import SQLAlchemy
# from flask import Flask
# from sqlalchemy import MetaData
# from flask_migrate import Migrate
# from Server.project_app import db

# class Album(db.Model):
#     __tablename__ = 'albums'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String)
#     track_list = db.Column(db.String)
#     released_date= db.Column(db.DateTime)
#     image = db.Column(db.String)
#     public = db.Column(db.Boolean)
#     artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    
#     #relationship
#     artist = db.relationship('Artist', backref='albums')

#     # Relationship with Liked_Song
#     liked_songs = db.relationship('Liked_Song', backref='album')
#     # add serialization rules
    
#     def __repr__(self):
#         return f'<Album {self.id, self.name, self.released_date, self.public}>'