from app_config import db
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from .BasketAssociation import song_basket_association

class SongBasket(db.Model):
    __tablename__ = 'song_baskets'

    basket_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'))

    @property
    def user(self):
        from .User import User
        return db.relationship('User', backref='song_baskets', lazy='dynamic')

    # @property
    # def songs(self):
    #     from .Song import Song
    #     return db.relationship('Song', secondary=song_basket_association, lazy='dynamic')

    songs = db.relationship('Song', secondary=song_basket_association, lazy='dynamic', back_populates='baskets')


    def to_dict(self):
        return {
            "basket_id": self.basket_id,
            "user_id": self.user_id,
        }

    def __repr__(self):
        return f'<SongBasket basket_id={self.basket_id}>'

class SongBasketSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SongBasket
