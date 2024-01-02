from app_config import db 
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
# Song.py
from .BasketAssociation import song_basket_association
# other imports and class definition
from .SongBasket import SongBasket



class Song(db.Model):
    __tablename__ = 'songs'
    
    id = db.Column(db.Integer, primary_key=True)
    track_id =db.Column(db.String)
    track_name=db.Column(db.String)
    track_image=db.Column(db.String)
    track_album=db.Column(db.String)
    track_artist=db.Column(db.String)
    # basket_id=db.Column(db.Integer, db.ForeignKey('song_baskets.basket_id'))
    # song_basket_id=db.Column(db.Integer, db.ForeignKey('song_baskets.id'))


    # baskets = db.relationship('SongBasket', secondary=song_basket_association, back_populates='songs')
    baskets = db.relationship('SongBasket', secondary=song_basket_association, back_populates='songs')

    def to_dict(self):
        return {
            'id': self.id,
            'track_id': self.track_id,
            'track_name': self.track_name,
            'track_image': self.track_image,
            'track_album': self.track_album,
            'track_artist': self.track_artist,
            'basket_id': self.basket_id

        }

class SongSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Song
        


    def __repr__(self):
        return f'<Song id={self.id}>'
    
