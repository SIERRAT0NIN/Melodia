from app_config import db 
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from datetime import datetime

class Token(db.Model):
    __tablename__ = 'tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    access_token = db.Column(db.String, nullable=False, unique=True)
    refresh_token = db.Column(db.String, nullable=False, unique=True)
    access_token_expires_at = db.Column(db.DateTime)
    refresh_token_expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)


    def __repr__(self):
        return f'<Token user_id={self.user_id}>'

