from app_config import db 
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    profile_pic = db.Column(db.String)
    password = db.Column(db.String)
    
    # def tokens(self):
    #     from .Token import Token
    #     return db.relationship('Token', backref='user', lazy='dynamic')

    # def song_baskets(self):
    #     from .SongBasket import SongBasket
    #     return db.relationship(SongBasket, back_populates='user', lazy='dynamic')

    def tokens(self):
        from .Token import Token
        return db.relationship('Token', backref='user', lazy='dynamic')

    def song_baskets(self):
        from .SongBasket import SongBasket
        return db.relationship('SongBasket', back_populates='user', lazy='dynamic')

    def verify_refresh_token(self, refresh_token_to_be_checked):
        return self.refresh_token == refresh_token_to_be_checked
    
    def __repr__(self):
        return f'<User id={self.id}, name={self.name}, username={self.username}>'

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
