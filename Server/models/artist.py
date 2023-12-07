from app_config import db, SerializerMixin  


class Artist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    bio = db.Column(db.String)
    stats = db.Column(db.Integer)
    #relationship
    
    # add serialization rules
    
    def __repr__(self):
        return f'<Artist {self.id, self.name, self.bio, self.stats }>'