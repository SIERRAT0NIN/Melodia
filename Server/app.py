from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import MetaData
from app_config import db, app, sp
from all_models import *
# from Models import Song, Token, User
from flask import request, url_for, session, redirect, make_response, jsonify
import time
import base64
import secrets
from sqlalchemy.exc import SQLAlchemyError

from datetime import datetime, timedelta
import jwt
import logging
from spotipy import Spotify, SpotifyException
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os
import requests

load_dotenv()
client_id = os.environ.get('SPOTIPY_CLIENT_ID')
client_secret = os.environ.get('SPOTIPY_CLIENT_SECRET')
redirect_uri = os.environ.get('REDIRECT_URI') 

TOKEN_INFO = 'token_info'
JWT_SECRET = '12346574839201928374637291029384'
JWT_ALGORITHM = "HS256"          
app.secret_key = 'din12823112390238ub09843209a1234'
api=Api(app)

#CORS Routes
CORS(app, resources={
        r"/store_refresh_token": {"origins": "http://localhost:5555"},
        r"/current_user": {"origins": "http://localhost:5555"},
        r"/store_user": {"origins": "http://localhost:5555"},
        r"/user_saved_tracks": {"origins": "http://localhost:5555"},
        r"/baskets": {"origins": "http://localhost:5555"},
        r"/song_basket/<string: user_id>": {"origins": "http://localhost:5555"},
        r"/create_song_basket": {"origins": "http://localhost:5555"},
        r"/song_basket/*": {"origins": "http://localhost:5555"}
    })   


def generate_jwt_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    print("PAYLOAD:", payload)
    # return jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256').decode('utf-8')

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError as e:
        # Log the specific error message for debugging
        print(f"Invalid token error: {str(e)}")
        return f'Invalid token. Please log in again. Error: {str(e)}'
    except Exception as e:
        # Catch any other exceptions that may occur
        print(f"Unexpected error: {str(e)}")
        return f'Unexpected error: {str(e)}'
# Working
def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=client_id,
        client_secret= client_secret,
        redirect_uri = redirect_uri, 
        scope='user-read-playback-position user-read-playback-state user-top-read user-library-read user-library-modify user-read-private user-read-email user-read-currently-playing app-remote-control streaming playlist-read-private user-modify-playback-state playlist-modify-public playlist-modify-private',
        cache_path=".cache", 
    )    

# Working
def get_token():
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        return None  
    now = int(time.time())
    is_expired = token_info['expires_at'] - now < 60
    
    if is_expired:
        token_info = refresh_access_token(token_info['refresh_token'])
        if token_info:
            session[TOKEN_INFO] = token_info  
        else:
            return None  
    
    return token_info

def exchange_code(code):
    try:
        spotify_oauth = create_spotify_oauth()
        token_info = spotify_oauth.get_access_token(code)
        session['token_info'] = token_info
        return token_info
    except spotipy.SpotifyException as e:
        app.logger.error(f"Error during token exchange: {str(e)}")
        return None
    except Exception as e:
        app.logger.error(f"Unexpected error during token exchange: {str(e)}")
        return None
    
def refresh_access_token(refresh_token):
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = {
        'Authorization': f'Basic {auth_header}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post('https://accounts.spotify.com/api/token', data=payload, headers=headers)
    if response.status_code == 200:
        refreshed_token_info = response.json()
        refreshed_token_info['expires_at'] = datetime.utcnow() + timedelta(seconds=refreshed_token_info.get('expires_in', 3600))
        return refreshed_token_info  
    else:

        print(f"Failed to refresh token: {response.text}")
        return None

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
    except spotipy.SpotifyException as e:
        return {'message': 'Error retrieving current user saved tracks'}
    except Exception as e:
        return {'message': 'Unexpected error retrieving current user saved tracks'}
def extract_access_token(self):
    authorization_header = request.headers.get('Authorization')
    if not authorization_header or 'Bearer ' not in authorization_header:
        raise ValueError('Authorization header is missing or invalid')
    return authorization_header.split('Bearer ')[1]

def extract_track_info(self, tracks):
    extracted_tracks = []
    for track_item in tracks:
        track_info = {
            'id': track_item['track']['id'],
            'name': track_item['track']['name'],
            'artist': track_item['track']['artists'][0]['name'],
            'album': track_item['track']['album']['name'],
            'image_url': track_item['track']['album']['images'][0]['url'] if track_item['track']['album']['images'] else None,
        }
        extracted_tracks.append(track_info)
    return extracted_tracks

def extract_track_info(self, saved_tracks):
    track_info_list = []

    for item in saved_tracks:
        track_info = {
            'id': item['track']['id'],
            'name': item['track']['name'],
            'artists': [artist['name'] for artist in item['track']['artists']],
            'album': {
                'id': item['track']['album']['id'],
                'name': item['track']['album']['name'],
                'release_date': item['track']['album']['release_date'],
                'image_url': item['track']['album']['images'][0]['url'] if item['track']['album']['images'] else None,
            },
            'added_at': item['added_at'],
        }
        track_info_list.append(track_info)

    return track_info_list

def create_playlist(user_id, access_token, playlist_name, public=True, collaborative=False, description=None):
    sp = spotipy.Spotify(auth=access_token)
    playlist = sp.user_playlist_create(user_id, name=playlist_name, public=public, collaborative=collaborative, description=description)
    return playlist

def get_refresh_token_for_user(user_id):

    token_record = RefreshToken.query.filter_by(user_id=user_id).first()
    
    if token_record:
        return token_record.refresh_token
    else:
        return None

def get_current_user_id():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        try:
            # Assuming the JWT token is after 'Bearer '
            decoded_token = jwt.decode(token.split(' ')[1], client_secret, algorithms=['HS256'])
            return decoded_token.get('user_id', None)
        except jwt.ExpiredSignatureError:
            # Handle expired token
            return None
        except jwt.InvalidTokenError:
            # Handle invalid token
            return None
    return None

def store_token_for_user(user_id, token_info):

    user_token = Token.query.filter_by(user_id=user_id).first()

    if not user_token:
        user_token = Token(user_id=user_id)
        db.session.add(user_token)

    user_token.access_token = token_info['access_token']
    user_token.refresh_token = token_info.get('refresh_token')
    user_token.expires_at = datetime.utcnow() + timedelta(seconds=token_info['expires_in'])
    db.session.commit()

def encode_client_credentials(client_id, client_secret):
    import base64
    client_credentials = f'{client_id}:{client_secret}'
    client_credentials_b64 = base64.b64encode(client_credentials.encode()).decode()
    return client_credentials_b64

def get_token_for_user(user_id):
    user_token = Token.query.filter_by(user_id=user_id).first()
    if user_token:
        if datetime.utcnow() < user_token.expires_at:
            return {
                'access_token': user_token.access_token,
                'refresh_token': user_token.refresh_token,
                'expires_at': user_token.expires_at
            }
        else:
            # Token is expired, so refresh it
            new_token_info = refresh_access_token(user_token.refresh_token)
            if new_token_info:
                user_token.access_token = new_token_info['access_token']
                user_token.refresh_token = new_token_info.get('refresh_token', user_token.refresh_token)
                user_token.expires_at = datetime.utcnow() + timedelta(seconds=new_token_info['expires_in'])
                db.session.commit()
                return {
                    'access_token': user_token.access_token,
                    'refresh_token': user_token.refresh_token,
                    'expires_at': user_token.expires_at
                }
    return None

def get_all_user_playlists(sp, limit=50):
    playlists = []
    offset = 0

    while True:
        response = sp.current_user_playlists(offset=offset, limit=limit)
        playlists.extend(response['items'])

        # Check if there are more playlists to fetch
        if len(response['items']) < limit:
            break
        offset += limit

    return playlists


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
        return redirect('https://melodia.netlify.app/token-exchange')

class TokenExchange(Resource):
    def get(self):
        code = request.args.get('code')
        if not code:
            return {'message': 'No code provided'}, 400
        token_info = exchange_code(code)
        if token_info:
            session['token_info'] = token_info
            return redirect('https://melodia.netlify.app/home')  
        else:
            return ({'error': str(e)}), 500
    def get(self):
        code = request.args.get('code')
        if not code:
            return {'message': 'No code provided'}, 400

        token_info = exchange_code(code)
        if token_info:
            # Optionally verify the Spotify access token here

            # Issue JWT
            jwt_token = generate_jwt_token(user_id=token_info['user_id'])  # Assuming you have a user ID
            return jsonify(access_token=jwt_token, token_type="Bearer"), 200
        else:
            return {'error': 'Failed to exchange code'}, 500
    
    def post(self):
        data = request.get_json()
        code = data.get('code')

        if not code:
            return ({'error': 'Authorization code not provided'}), 400

        try:
            spotify_oauth = SpotifyOAuth(client_id=client_id,
                                         client_secret=client_secret,
                                         redirect_uri=redirect_uri)
            token_info = spotify_oauth.get_access_token(code)
            return (token_info), 200
        except spotipy.SpotifyException as e:
            return ({'error': str(e)}), 500     
 
class SavedSongs(Resource):

    def get(self):
        access_token = self.get_access_token_from_request()
        if not access_token:
            return {'message': 'Access token is missing or invalid'}, 401
        return {'message': 'Successfully authenticated with JWT'}, 200

    def get_access_token_from_request(self):
        """
        The function `get_access_token_from_request` extracts the access token from the Authorization header
        in a request.
        :return: The access token is being returned.
        """

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
     
            return None
        return auth_header.split(' ')[1]
    def extract_songs(self, results):
    
        songs = []
        for item in results['items']:
            track = item['track']
            songs.append({
                "id": track["id"],
                "name": track["name"],
                "artists": [artist["name"] for artist in track["artists"]],
                "album": track["album"]["name"]
            })
            logging.debug('This is a debug message')
        return songs

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

class CurrentUser(Resource):
    def get(self):
        try:
            token_info = get_token()
            if not token_info or 'access_token' not in token_info:
                return {'message': 'Invalid or missing token'}, 401

            sp = spotipy.Spotify(auth=token_info['access_token'])
            user_info = sp.current_user()
            return user_info
        except spotipy.SpotifyException as e:

            return {'message': f'Error retrieving Spotify user information: {e}'}, e.http_status
        except Exception as e:

            return {'message': f'Error retrieving current user information: {str(e)}'}, 500

class UserPlaylists(Resource):
    def get(self):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])

            playlists = get_all_user_playlists(sp)

            playlist_details = []
            for playlist in playlists:
                playlist_id = playlist['id']
                playlist_name = playlist['name']
                playlist_description = playlist['description']
                total_tracks = playlist['tracks']['total']
                is_public = playlist['public']
                image_url = playlist['images'][0]['url'] if playlist['images'] else None

                playlist_details.append({
                    'id': playlist_id,
                    'name': playlist_name,
                    'description': playlist_description,
                    'total_tracks': total_tracks,
                    'public': is_public,
                    'image_url': image_url
                })

            return {'playlists': playlist_details}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': f'Error retrieving user playlists: {str(e)}'}

class CurrentUserTopArtists(Resource):
    def get(self, time_range='medium_term', limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            top_artists = sp.current_user_top_artists(time_range=time_range, limit=limit)['items']

            artist_info_list = []
            for artist in top_artists:
                artist_info = {
                    'name': artist['name'],
                    'id': artist['id'],
                    'uri': artist['uri'],
                    'images': [image['url'] for image in artist['images']],
                    'genres': artist['genres'],
                    'popularity': artist['popularity']
                }
                artist_info_list.append(artist_info)

            return {'artists': artist_info_list}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error retrieving current user top artists'}

class CurrentUserTopTracks(Resource):
    def get(self, time_range='medium_term', limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            top_tracks = sp.current_user_top_tracks(time_range=time_range, limit=limit)['items']

            track_info_list = []
            for track in top_tracks:
                track_info = {
                    'name': track['name'],
                    'id': track['id'],
                    'uri': track['uri'],
                    'album': {
                        'name': track['album']['name'],
                        'id': track['album']['id'],
                        'uri': track['album']['uri']
                    },
                    'artists': [{'id': artist['id'], 'name': artist['name'], 'uri': artist['uri']} for artist in track['artists']],
                    'duration_ms': track['duration_ms'],
                    'popularity': track['popularity']
                }
                track_info_list.append(track_info)

            return {'tracks': track_info_list}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error retrieving current user top tracks'}

class CurrentlyPlaying(Resource): #Not working
    def get(self):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            currently_playing = sp.current_playback()

            if currently_playing is None:
                return {'message': 'No track currently playing.'}

            # Extract relevant information from the currently playing response
            track_info = {
                'name': currently_playing['item']['name'],
                'id': currently_playing['item']['id'],
                'uri': currently_playing['item']['uri'],
                'album': {
                    'name': currently_playing['item']['album']['name'],
                    'id': currently_playing['item']['album']['id'],
                    'uri': currently_playing['item']['album']['uri']
                },
                'artists': [{'id': artist['id'], 'name': artist['name'], 'uri': artist['uri']} for artist in currently_playing['item']['artists']],
                'duration_ms': currently_playing['item']['duration_ms'],
                'progress_ms': currently_playing['progress_ms']
            }

            return {'currently_playing': track_info}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': f'Error retrieving currently playing track: {str(e)}'}

class FeaturedPlaylists(Resource):
    def get(self, limit=20):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            
            # Use spotipy's featured_playlists method
            featured_playlists = sp.featured_playlists(limit=limit)['playlists']['items']

          
            playlists_info = []
            for playlist in featured_playlists:
                name = playlist['name']
                playlist_id = playlist['id']
                images = playlist['images'] if 'images' in playlist else []
                image_urls = [image['url'] for image in images]
                owner = playlist['owner']['id'] if 'owner' in playlist else None
                is_public = playlist['public']
                description = playlist['description']
                total_tracks = playlist['tracks']['total'] if 'tracks' in playlist else None

                # Determine if the playlist is public or private
                visibility = 'Public' if is_public else 'Private'

                playlist_info = {
                    'id': playlist_id,
                    'name': name,
                    'images': image_urls,
                    'owner': owner,
                    'visibility': visibility,
                    'description': description,
                    'total_tracks': total_tracks
                }
                playlists_info.append(playlist_info)

            return {'playlists': playlists_info}
        except Exception as e:
            print(f"Error: {str(e)}")
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

class CreatePlaylist(Resource):
    def post(self):
        data = request.json
        user_id = data.get('user_id')
        playlist_name = data.get('playlist_name')

        if not user_id or not playlist_name:
            return {'message': 'Missing user_id or playlist name'}, 400

        refresh_token = get_refresh_token_for_user(user_id)
        if not refresh_token:
            return {'error': 'No refresh token found for user'}, 404

        access_token = refresh_access_token(refresh_token)
        if not access_token:
            return {'error': 'Failed to get access token'}, 401

        playlist = create_playlist(user_id, access_token, playlist_name)
        return {'message': 'Playlist created successfully', 'playlist_id': playlist['id']}

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
    def post(self, playlist_id, track_uri):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            sp.playlist_add_items(playlist_id, track_uri)
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

class Logout(Resource):
    def get(self):
        # Clear the user's session data
        session.clear()

        # Redirect to the Authenticate page or a login page
        return redirect(url_for('home'))

class CurrentUserSavedTracksDelete(Resource):
    def delete(self, track_id):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            sp.current_user_saved_tracks_delete([track_id])
            return {'message': 'Track removed from user\'s saved tracks successfully'}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error removing track from user\'s saved tracks'}

class UserPlaylistChangeDetails(Resource):
    def put(self, playlist_id, name, description, public):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            sp.user_playlist_change_details(playlist_id, name=name, description=description, public=public)
            return {'message': 'Playlist details updated successfully'}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error updating playlist details'}

class UserPlaylistUnfollow(Resource):
    def delete(self, playlist_id):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            sp.user_playlist_unfollow(playlist_id)
            return {'message': 'Playlist unfollowed successfully'}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error unfollowing playlist'}

class UserPlaylistCreate(Resource):
    def post(self, name, public=False, collaborative=False, description=None):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            playlist = sp.user_playlist_create(
                sp.current_user()['id'],
                name=name,
                public=public,
                collaborative=collaborative,
                description=description
            )
            return {'message': 'Playlist created successfully', 'playlist_id': playlist['id']}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error creating playlist'}

class UserPlaylistFollow(Resource):
    def put(self, playlist_id):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])
            sp.user_playlist_follow_playlist(sp.current_user()['id'], playlist_id)
            return {'message': 'Playlist followed successfully'}
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error following playlist'}

class AccessTokenResource(Resource):
    def get(self):
        # Authenticate the user here
        user_id = get_current_user_id()

        # Retrieve the access token from the database
        token_info = get_token_for_user(user_id)

        if token_info:
            return {'access_token': token_info['access_token']}
        else:
            return {'message': 'Token not found'}, 404
        
class StoreTokens(Resource):
    def post(self):
        try:
            # Parsing data from the request's JSON body
            data = request.json
            user_id = data.get('user_id')
            access_token = data.get('access_token')

            # Check if both user_id and access_token are provided
            if not user_id or not access_token:
                return {'message': 'Missing user_id or access token'}, 400

            # Retrieve the user record from the database
            user = User.query.filter_by(user_id=user_id).first()

            # If user exists, update the access token
            if user:
                user.access_token = access_token
            else:
                # Optionally, create a new user record if it doesn't exist
                # user = User(user_id=user_id, access_token=access_token)
                # db.session.add(user)
                return {'error': 'User not found'}, 404

            # Save changes to the database
            db.session.commit()

            return {'message': 'Access token updated successfully'}, 200

        except Exception as e:
            # Handle any unexpected exceptions
            return {'message': str(e)}, 500


        
class RefreshTokenResource(Resource):
    def post(self):
        try:
            data = request.json
            user_id = data.get('user_id') 
            refresh_token = data.get('refresh_token')

            if not user_id or not refresh_token:
                return {'message': 'Missing user_id or refresh token'}, 400

            # Check if a token already exists for the user
            existing_token = RefreshToken.query.filter_by(user_id=user_id).first()
            
            if existing_token:
                
                existing_token.refresh_token = refresh_token
            else:
                
                new_token = RefreshToken()
                new_token.user_id = user_id
                new_token.refresh_token = refresh_token
                db.session.add(new_token)

            db.session.commit()

            return {'message': 'Refresh token stored successfully'}, 200
        except Exception as e:
            return {'message': str(e)}, 500

class Refresh(Resource):
    def post(self):
        # Step 1: Retrieve user_id and refresh token
        logging.info(f"Received request data: {request.json}")
        user_id = request.json.get('user_id')
        if not user_id or user_id is None:
            return {'error': 'User ID is missing or invalid'}, 400


        user = RefreshToken.query.filter_by(user_id=user_id).first()
        if not user:
            return {'error': 'User not found'}, 404

        refresh_token = user.refresh_token
        if not refresh_token:
            return {'error': 'Refresh token not found'}, 404

        #Request a new access token using Spotipy
        oauth = spotipy.SpotifyOAuth(client_id=client_id, 
                                     client_secret=client_secret,
                                     redirect_uri=redirect_uri)
        token_info = oauth.refresh_access_token(refresh_token)

        #Update the access token in the database
        user.access_token = token_info['access_token']
        db.session.commit()


        return {'access_token': token_info['access_token']}, 200




class StoreUser(Resource):
    def post(self):
        data = request.get_json()

        existing_user = User.query.filter(
            (User.email == data.get('email')) | 
            (User.username == data.get('userId'))
        ).first()

        if existing_user:
            return {'error': 'User already exists with this email or username'}, 409


        required_fields = ['email', 'name', 'userId', ]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return {'error': f'Missing fields: {", ".join(missing_fields)}'}, 400


        new_user = User(
            email=data.get('email'),
            name=data.get('name'),
            username=data.get('userId'),
            profile_pic=data.get('userImage', 'default_image.jpg')
        )
        db.session.add(new_user)


        try:
            db.session.commit()
            return {'message': 'User created successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

    def options(self):
        return {'message': 'OK'}, 200


class StoreTokensResource(Resource):
    def post(self):
        try:
            data = request.get_json()


            if 'access_token_expires_at' not in data or 'refresh_token_expires_at' not in data:
                return {'error': 'Missing access_token_expires_at or refresh_token_expires_at'}, 400

            access_token_expires_at = datetime.fromtimestamp(data['access_token_expires_at'])
            refresh_token_expires_at = datetime.fromtimestamp(data['refresh_token_expires_at'])

            new_token = Token(
                user_id=data['user_id'],
                access_token=data['access_token'],
                refresh_token=data['refresh_token'],
                access_token_expires_at=access_token_expires_at,
                refresh_token_expires_at=refresh_token_expires_at
            )

            db.session.add(new_token)
            db.session.commit()
            return {'message': 'Token stored successfully'}, 201
        except KeyError as e:
            return {'error': f'Missing key in request data: {str(e)}'}, 400
        except Exception as e:
            return {'error': str(e)}, 500



def decode_jwt(token):
    try:

        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return {'error': 'Signature expired. Please log in again.', 'status': 'expired'}
    except jwt.InvalidTokenError as e:
        return {'error': f'Invalid token. Please log in again. Detail: {str(e)}', 'status': 'invalid'}
    except Exception as e:
        return {'error': f'An error occurred: {str(e)}', 'status': 'error'}

class VerifyToken(Resource):
    def post(self):
        token = request.json.get('token', None)
        if not token:
            return {'message': 'Token is missing!'}, 400
        decoded = decode_jwt(token)
        if 'error' in decoded:
            return {'message': decoded['error']}, 401

       
        user_id = decoded.get('sub', None)
        return {'message': "Token is valid!", 'user_id': user_id}, 200

class RequestJWT(Resource):
    def post(self):
        try:

            user_data = request.get_json()


            if not user_data or 'user_id' not in user_data:
                return jsonify({'error': 'user_id is required'}), 400


            token = self.generate_jwt_token(user_data['user_id'])
            return jsonify({'jwt': token})
        except Exception as e:
            logging.error(f"Error in generating JWT: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500

    @staticmethod
    def generate_jwt_token(user_id):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@app.route('/songs', methods=['POST'])
def add_song_to_basket():
    from sqlalchemy import text
    data = request.json
    print("Received data:", data)  
    


    if not isinstance(data, list):
        data = [data]

    added_songs = []
    errors = []

    for song_data in data:
    
        print("Processing song:", song_data)  

        # Validate each song data
        required_keys = ["track_id", "track_name", "track_image", "track_album", "track_artist", "track_uri", "basket_id"]


        if not all(k in song_data for k in required_keys):
            errors.append({"error": "Missing data", "song": song_data})
            continue
        # Extract song details from song_data
        track_id = song_data['track_id']
        track_name = song_data['track_name']
        track_image = song_data['track_image']
        track_album = song_data['track_album']
        track_artist = song_data['track_artist']
        track_uri = song_data['track_uri']
        basket_id = song_data['basket_id']

        # Create a new SongBasket instance
        new_song_basket = Song(track_id=track_id, track_name=track_name, track_image=track_image, track_album=track_album, track_artist=track_artist, track_uri=track_uri, basket_id=basket_id, )

        try:
            db.session.add(new_song_basket)
            db.session.flush()
            added_songs.append({"track_id": new_song_basket.id, "track_id": track_id, "track_name":track_name, "track_image":track_image,'track_album':track_album,'track_artist':track_artist, 'track_uri':track_uri,'basket_id':basket_id}, )
         
            db.session.execute(text(f'INSERT INTO song_basket_association (basket_id, song_id) VALUES ({basket_id}, {new_song_basket.id})'))
        except Exception as e:
            db.session.rollback()

            errors.append({"error": str(e), "song": song_data})
            continue
    if errors:
        return jsonify({"added_songs": added_songs, "errors": errors}), 207 
    else:
        db.session.commit()
        return jsonify({"added_songs": added_songs}), 201

class GetTokenResource(Resource):
    def get(self, user_id):
        token = Token.query.filter_by(user_id=user_id).first()
        if token:
            return {'access_token': token.access_token}, 200
        else:
            return {'error': 'Token not found'}, 404
        
        
# from jwt_extended import jwt_required
# @jwt_required()
class CreateSongBasket(Resource):
    def post(self):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'message': 'Authorization token is missing or invalid'}), 401

            access_token = auth_header.split(' ')[1]
            data = request.json
            songs = data.get('songs', [])
            user_id = data.get('user_id')
            playlist_name = data.get('playlist_name')
            playlist_description = data.get('playlist_description')
            playlist_img= data.get('playlist_img')
            
            
            new_basket = SongBasket(
                user_id=user_id,
                playlist_name=playlist_name,
                playlist_description=playlist_description,
                playlist_img=playlist_img
            )
            db.session.add(new_basket)
            db.session.flush()

            for song_data in songs:
                new_song = Song(
                    track_id=song_data['track_id'],
                    track_name=song_data['track_name'],
                    track_image=song_data['track_image'],
                    track_album=song_data['track_album'],
                    track_artist=song_data['track_artist'],
                    track_uri=song_data['track_uri'],
                    basket_id=new_basket.basket_id
                )
                db.session.add(new_song)
            # import ipdb; ipdb.set_trace()
            db.session.commit()
            return {"message": "Song basket created", "basket_id": new_basket.basket_id}, 201

        except Exception as e:
            db.session.rollback()
            return {'message': f'An error occurred: {str(e)}'}, 422
api.add_resource(CreateSongBasket,'/create_song_basket')

#get_jwt_identity()
class SongBasketResource(Resource):

    def get(self, user_id):
        # Fetch all song baskets for the user
        baskets = SongBasket.query.filter_by(user_id=user_id).all()

        # if not baskets:
        #     return [], 200

        all_baskets_data = []
        for basket in baskets:
            # Fetch songs for each basket
            songs = Song.query.join(song_basket_association).filter(song_basket_association.c.basket_id == basket.basket_id).all()
            basket_data = {
                'basket_id': basket.basket_id,
                'songs': [song.to_dict() for song in songs],
                'playlist_name': basket.playlist_name,
                'playlist_description': basket.playlist_description,
                'playlist_img': basket.playlist_img
            }
            all_baskets_data.append(basket_data)

        return all_baskets_data
    
    def post(self, user_id):
        new_basket = SongBasket(user_id=user_id)
        print('user id',user_id)
        db.session.add(new_basket)
        db.session.commit()
        return {'message': 'Basket created'}, 201
    
    def delete(self, user_id, basket_id, id):

        basket = SongBasket.query.filter_by(user_id=user_id, basket_id=basket_id).first()
        if not basket:
            return {'message': 'Basket not found'}, 404

        song = Song.query.get(id)
        if not song:
            return {'message': 'Song not found'}, 404

        try:
            basket.songs.remove(song)
            db.session.commit()
            return {'message': 'Song removed from basket'}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {'message': str(e)}, 500

    def patch(self, user_id, basket_id):
        basket = SongBasket.query.filter_by(user_id=user_id, basket_id=basket_id).first()
        if not basket:
            return {'message': 'Basket not found'}, 404

        data = request.json
        try:
            if 'playlist_name' in data:
                basket.playlist_name = data['playlist_name']
            if 'playlist_description' in data:
                basket.playlist_description = data['playlist_description']
            if 'playlist_img' in data:
                basket.playlist_img = data['playlist_img']

            db.session.commit()
            return {'message': 'Basket updated successfully'}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {'message': str(e)}, 500 #change 500, always created

# Route registration
api.add_resource(SongBasketResource, 
                '/song_basket/<string:user_id>', 
                '/song_basket/<string:user_id>/<int:basket_id>', 
                '/song_basket/<string:user_id>/<int:basket_id>/<int:id>')

class DeleteBasketResource(Resource):
    def delete(self, user_id, basket_id):
        basket = SongBasket.query.filter_by(user_id=user_id, basket_id=basket_id).first()
        if not basket:
            return {'message': 'Basket not found'}, 404

        try:
            # Remove all songs from the basket first
            for song in basket.songs:
                basket.songs.remove(song)
            
            db.session.delete(basket)
            db.session.commit()
            return {'message': 'Basket deleted successfully'}, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return {'message': str(e)}, 500

# Route for basket deletion
api.add_resource(DeleteBasketResource, '/delete_basket/<string:user_id>/<int:basket_id>')

# Adding the resource to the API
api.add_resource(GetTokenResource, '/get_token/<string:user_id>')
api.add_resource(VerifyToken, '/verify_token')
api.add_resource(RequestJWT, '/request_jwt')
api.add_resource(Home, '/home')
api.add_resource(TokenExchange, '/token-exchange')
api.add_resource(AccessTokenResource, '/access_token')
api.add_resource(StoreTokensResource, '/store_tokens')
api.add_resource(Redirect, '/redirect')
api.add_resource(Refresh, '/refresh_token')
api.add_resource(RefreshTokenResource, '/store_refresh_token') #Working
api.add_resource(StoreUser, '/store_user') #Working
#Routes
api.add_resource(CurrentUser, '/current_user')
api.add_resource(SavedSongs, '/user_saved_tracks')
api.add_resource(Logout, '/logout')
#Not Used
api.add_resource(FeaturedPlaylists, '/featured_playlists')
api.add_resource(CurrentUserSavedTracksDelete, '/current_user_saved_tracks_delete/<string:track_id>')
api.add_resource(CurrentUserTopArtists, '/current_user_top_artists')
api.add_resource(CurrentUserTopTracks, '/current_user_top_tracks')
api.add_resource(CurrentlyPlaying, '/currently_playing') #Not working
api.add_resource(Search, '/search')#Not working
api.add_resource(SearchArtist, '/search_artist/<string:artist_name>')
api.add_resource(Track, '/track/<string:track_id>')
api.add_resource(Tracks, '/tracks')
api.add_resource(UserPlaylistCreate, '/user_playlist_create/<string:name>/<int:public>/<int:collaborative>/<string:description>')
api.add_resource(Playlist, '/playlist/<string:playlist_id>')
api.add_resource(UserPlaylists, '/user_playlists')
api.add_resource(UserPlaylistChangeDetails, '/user_playlist_change_details/<string:playlist_id>/<string:name>/<string:description>/<int:public>')
api.add_resource(PlaylistAddItems, '/playlist_add_items/<string:playlist_id>')
api.add_resource(PlaylistCoverImage, '/playlist_cover_image/<string:playlist_id>')
api.add_resource(UserPlaylistUnfollow, '/user_playlist_unfollow/<string:playlist_id>')
api.add_resource(UserPlaylistFollow, '/user_playlist_follow/<string:playlist_id>')




if __name__ == '__main__':
    app.run(debug=True, port=5556)




