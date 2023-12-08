
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, request, url_for, session, redirect
from flask_restful import Api, Resource
from dotenv import load_dotenv
from spotipy import util
import spotipy
import os
import time


load_dotenv()
client_id = os.environ.get('SPOTIPY_CLIENT_ID')
client_secret = os.environ.get('SPOTIPY_CLIENT_SECRET')


app = Flask(__name__)
app.config['SESSION_COOKIE_NAME'] = 'Spotify Cookie'
app.secret_key = 'din12823112390238ub09843209a1234'
TOKEN_INFO = 'token_info'
api = Api(app)
sp = spotipy.Spotify()


class Home(Resource):
    def get(self):
        auth_url = create_spotify_oauth().get_authorize_url()
        return redirect(auth_url)


class Redirect(Resource):
    def get(self):
        session.clear()
        code = request.args.get('code')
        token_info = create_spotify_oauth().get_access_token(code)
        session[TOKEN_INFO] = token_info
        return redirect(url_for('currentusertopartists'))


class SavedSongs(Resource):
    def get(self):
        try:
            token_info = get_token()
        except:
            print("User not logged in")
            return redirect('user_saved_songs')
        return "OAUTH SUCCESSFUL"

class UserSavedTracks(Resource):
    def get(self):
        saved_tracks = current_user_saved_tracks()
        return saved_tracks
    
class SearchArtist(Resource):
    def get(self, artist_name):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            result = sp.search(q=artist_name, type='artist', limit=1)
            if result['artists']['items']:
                artist_id = result['artists']['items'][0]['id']
                return {'artist_id': artist_id}
            else:
                return {'message': 'Artist not found'}
        except:
            return {'message': 'Error searching for artist'}

def current_user():
    try:
        token_info = get_token()
        sp = spotipy.Spotify(auth=token_info['access_token'])
        user_info = sp.current_user()
        return user_info
    except:
        return {'message': 'Error retrieving current user information'}

def current_user_playlists():
    try:
        token_info = get_token()
        sp = spotipy.Spotify(auth=token_info['access_token'])
        playlists = sp.current_user_playlists()
        return playlists
    except:
        return {'message': 'Error retrieving current user playlists'}

def current_user_saved_tracks():
    try:
        token_info = get_token()
        sp = spotipy.Spotify(auth=token_info['access_token'])
        saved_tracks = sp.current_user_saved_tracks()
        return saved_tracks
    except:
        return {'message': 'Error retrieving current user saved tracks'}


def get_token():
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        redirect(url_for('login', external=False))

    now = int(time.time())

    is_expired = token_info['expires_at'] - now < 60
    if is_expired:
        spotify_oauth = create_spotify_oauth()
        token_info = spotify_oauth.refresh_access_token(token_info['refresh_token'])
    return token_info


def create_spotify_oauth():
    return SpotifyOAuth(
        client_id,
        client_secret,
        redirect_uri=url_for('redirect', _external=True),
        scope='user-top-read user-library-read user-library-modify user-read-private user-read-email'
    )
class CurrentUser(Resource):
    def get(self):
        user_info = current_user()
        return user_info

class UserPlaylists(Resource):
    def get(self):
        playlists = current_user_playlists([])
        return playlists


class CurrentUserTopArtists(Resource):
    def get(self, time_range='medium_term', limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            top_artists = sp.current_user_top_artists(time_range=time_range, limit=limit)['items']
           
            artist_names = [artist['name'] for artist in top_artists]
            return {'artists': artist_names}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error retrieving current user top artists'}

class CurrentUserTopTracks(Resource):
    def get(self, time_range='medium_term', limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            top_tracks = sp.current_user_top_tracks(time_range=time_range, limit=limit)
            return top_tracks
        except:
            return {'message': 'Error retrieving current user top tracks'}

class CurrentlyPlaying(Resource):
    def get(self):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            currently_playing = sp.current_playback()
            return currently_playing
        except:
            return {'message': 'Error retrieving currently playing track'}

class FeaturedPlaylists(Resource):
    def get(self, limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            featured_playlists = sp.featured_playlists(limit=limit)
            return featured_playlists
        except:
            return {'message': 'Error retrieving featured playlists'}

class Playlist(Resource):
    def get(self, playlist_id):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            playlist = sp.playlist(playlist_id)
            return playlist
        except:
            return {'message': 'Error retrieving playlist'}

class PlaylistCoverImage(Resource):
    def get(self, playlist_id):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            playlist_cover_image = sp.playlist_cover_image(playlist_id)
            return playlist_cover_image
        except:
            return {'message': 'Error retrieving playlist cover image'}

class PlaylistAddItems(Resource):
    def post(self, playlist_id, track_uris):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            sp.playlist_add_items(playlist_id, track_uris)
            return {'message': 'Tracks added to playlist successfully'}
        except:
            return {'message': 'Error adding tracks to playlist'}

class Search(Resource):
    def get(self, query, type='track', limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            search_results = sp.search(q=query, type=type, limit=limit)
            return search_results
        except:
            return {'message': 'Error performing search'}

class Track(Resource):
    def get(self, track_id):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            track = sp.track(track_id)
            return track
        except:
            return {'message': 'Error retrieving track information'}

class Tracks(Resource):
    def get(self, track_ids):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            tracks = sp.tracks(track_ids)
            return tracks
        except:
            return {'message': 'Error retrieving tracks information'}


#Routes

api.add_resource(CurrentUserTopArtists, '/current_user_top_artists')
api.add_resource(CurrentUserTopTracks, '/current_user_top_tracks')
api.add_resource(CurrentlyPlaying, '/currently_playing')
api.add_resource(FeaturedPlaylists, '/featured_playlists')
api.add_resource(Playlist, '/playlist/<string:playlist_id>')
api.add_resource(PlaylistCoverImage, '/playlist_cover_image/<string:playlist_id>')
api.add_resource(PlaylistAddItems, '/playlist_add_items/<string:playlist_id>')
api.add_resource(Search, '/search')
api.add_resource(Track, '/track/<string:track_id>')
api.add_resource(Tracks, '/tracks')
api.add_resource(CurrentUser, '/current_user')
api.add_resource(UserPlaylists, '/user_playlists')
api.add_resource(UserSavedTracks, '/user_saved_tracks')
api.add_resource(Home, '/')
api.add_resource(Redirect, '/redirect')
api.add_resource(SearchArtist, '/search_artist/<string:artist_name>')

if __name__ == '__main__':
    app.run(debug=True)
