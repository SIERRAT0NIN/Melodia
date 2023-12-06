from app_config import db, SerializerMixin  


class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    track_id = db.Column(db.String)
    user_id = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    public = db.Column(db.Boolean)
    #relationship
    
    # add serialization rules
    
    def __repr__(self):
        return f'<User {self.id}>'