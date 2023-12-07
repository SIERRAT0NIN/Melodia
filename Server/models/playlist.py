from app_config import db, SerializerMixin  


class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime)
    public = db.Column(db.Boolean)
    #relationship
    
    # add serialization rules
    
    def __repr__(self):
        return f'<Playlist {self.id}>'