from app_config import db, SerializerMixin  


class Album(db.Model, SerializerMixin):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    released_date= db.Column(db.DateTime)
    public = db.Column(db.Boolean)
    #relationship
    
    # add serialization rules
    
    def __repr__(self):
        return f'<Album {self.id,self.name,self.released_date,self.public}>'