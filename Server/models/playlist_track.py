from app_config import db, SerializerMixin  

class Playlist_Track(db.Model, SerializerMixin):
    __tablename__ = 'playlist_tracks'

    track_id = db.Column(db.String)
    playlist_id = db.Column(db.String)

    #relationship
    
    # add serialization rules
    
    def __repr__(self):
        return f'<Playlist_Track {self.track_id, self.playlist_id}>'