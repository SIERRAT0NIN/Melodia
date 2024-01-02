
from app_config import db

song_basket_association = db.Table('song_basket_association',
    db.Column('song_id', db.Integer, db.ForeignKey('songs.id'), primary_key=True),
    db.Column('basket_id', db.Integer, db.ForeignKey('song_baskets.basket_id'), primary_key=True)
)
