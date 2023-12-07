from app_config import db, SerializerMixin  


class Track(db.Model, SerializerMixin):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    image = db.Column(db.Integer)
    artist_id = db.Column(db.Integer)
    album_id = db.Column(db.Integer)
    stats = db.Column(db.String)
    liked = db.Column(db.Boolean)
    
    #relationship
    
    # add serialization rules
    
    def __repr__(self):
        return f'<Track{self.id,self.title,self.description,self.image,self.stats,self.liked}>'