from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import MetaData
from app_config import db, app
from all_models import *
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, request, url_for, session, redirect, make_response, jsonify
from dotenv import load_dotenv
from spotipy import util
import spotipy
import os
import time


from spotipy import Spotify, SpotifyException
load_dotenv()
client_id = os.environ.get('SPOTIPY_CLIENT_ID')
client_secret = os.environ.get('SPOTIPY_CLIENT_SECRET')
redirect_uri = os.environ.get('REDIRECT_URI') 
TOKEN_INFO = 'token_info'
app.secret_key = 'din12823112390238ub09843209a1234'

sp = spotipy.Spotify()
migrate = Migrate(app, db)
db.init_app(app)
api=Api(app)
CORS(app, resources={
        r"/store_refresh_token": {"origins": "http://localhost:5555"},
        r"/current_user": {"origins": "http://localhost:5555"},
        r"/store_user": {"origins": "http://localhost:5555"},
    })    



#Scope
def create_spotify_oauth():
    return SpotifyOAuth(
        client_id,
        client_secret,
        redirect_uri = redirect_uri, 
        scope='playlist-modify-public playlist-modify-private user-top-read user-library-read user-library-modify user-read-private user-read-email user-read-currently-playing app-remote-control streaming playlist-read-private user-modify-playback-state playlist-modify-public playlist-modify-private',
        cache_path=".cache", 
    )

def get_token():
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        return redirect(url_for('home'))

    now = int(time.time())
    is_expired = token_info['expires_at'] - now < 60
    
    
    if is_expired:
        spotify_oauth = create_spotify_oauth()

        # Use open_url to manually get a new access token with an extended expiration time
        new_token_info = spotify_oauth.open_url(spotify_oauth.get_authorize_url(show_dialog=False))
        token_info['access_token'] = new_token_info['access_token']
        token_info['expires_at'] = new_token_info['expires_at']

    
    return token_info


def exchange_code(code):
    try:
        spotify_oauth = create_spotify_oauth()
        token_info = spotify_oauth.get_access_token(code)
        session['token_info'] = token_info
        return token_info
    except spotipy.SpotifyException as e:
        # Handle Spotify API exceptions, e.g., invalid code, etc.
        app.logger.error(f"Error during token exchange: {str(e)}")
        return None
    except Exception as e:
        # Handle other exceptions
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
        return response.json()['access_token']
    else:
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
        app.logger.error(f"Spotify API Error: {str(e)}")
        return {'message': 'Error retrieving current user saved tracks'}
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        
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
    
class TokenExchange(Resource):
    def get(self):
        
        code = request.args.get('code')

   
        token_info = exchange_code(code)

        
        session['token_info'] = token_info
        app.logger.info(f'Token Info: {token_info}')


       
        redirect_url = url_for('authenticate')  
        return redirect(redirect_url)
    def post(self):
      
        code = request.form.get('code')

        
        token_info = exchange_code(code)

        
        session['token_info'] = token_info
        print(f'token infor:', token_info)

       
        return redirect(url_for(redirect_uri))

class Authenticate(Resource):
    def get(self):
        auth_url = create_spotify_oauth().get_authorize_url()
        # import ipdb; ipdb.set_trace()
        print(auth_url)
        return redirect(auth_url)    


class LoginPage(Resource):
    def get(self):  
        return 'Sign In with Spotify!'
    
class Home(Resource):
    def get(self):
        # auth_url = create_spotify_oauth().get_authorize_url() 
        return (f'Hello, World!')
class UserSavedTracks(Resource):
    def get(self):
        try:
            access_token = self.extract_access_token()
            sp = Spotify(auth=access_token)
            saved_tracks_response = sp.current_user_saved_tracks()
            extracted_tracks = self.extract_track_info(saved_tracks_response.get('items', []))
            return jsonify({'tracks': extracted_tracks})
        except SpotifyException as spotify_error:
            return jsonify({'message': f'Spotify API Error: {str(spotify_error)}'}), 500
        except Exception as generic_error:
            return jsonify({'message': f'Error retrieving user saved tracks: {str(generic_error)}'}), 500
        
class Redirect(Resource):
    def get(self):
        session.clear()
        code = request.args.get('code')
        token_info = create_spotify_oauth().get_access_token(code)
        session[TOKEN_INFO] = token_info
        return redirect(url_for(redirect_uri))

class SavedSongs(Resource):
    def get(self):
        try:
            token_info = get_token()
        except:
            print("User not logged in")
            return redirect('usersavedsongs')
        return "OAUTH SUCCESSFUL"

    def extract_track_info(self, saved_tracks):
        try:
            token_info = get_token()
            sp = spotipy.Spotify(auth=token_info['access_token'])

            track_info_list = []
            for item in saved_tracks['items']:
                track = item['track']

                # Extracting information about the track
                artist_info = track['artists'][0]
                artist_name = artist_info['name']
                artist_id = artist_info['id']
                artist_uri = artist_info['uri']

                # Retrieve artist details to get genres
                artist_details = sp.artist(artist_id)
                genres = artist_details['genres'] if 'genres' in artist_details else []

                album_info = track['album']
                album_name = album_info['name']
                album_images = album_info['images'] if 'images' in album_info else []
                album_image_urls = [image['url'] for image in album_images]
                release_date = album_info.get('release_date', None)
                track_title = track['name']

                # Creating a dictionary with the extracted information
                track_info = {
                    'artist_name': artist_name,
                    'artist_id': artist_id,
                    'artist_uri': artist_uri,
                    'genres': genres,
                    'album_name': album_name,
                    'album_images': album_image_urls,
                    'release_date': release_date,
                    'track_title': track_title
                }

                track_info_list.append(track_info)

            return {'tracks': track_info_list}

        except Exception as e:
            print(f"Error: {str(e)}")
            return {'message': 'Error retrieving user saved tracks'}


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
            sp = spotipy.Spotify(auth=token_info['access_token'])
            if not token_info or 'access_token' not in token_info:
                return {'message': 'Invalid or missing token'}
            user_info = sp.current_user()
            return user_info
        except Exception as e:
            return {'message': f'Error retrieving current user information: {str(e)}'}


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

            # Extracting more details about each playlist
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
        
        
class RefreshTokenResource(Resource):
    def post(self):
        try:
            data = request.json
            user_id = data.get('user_id')  # Make sure to send user_id from your frontend
            refresh_token = data.get('refresh_token')

            if not user_id or not refresh_token:
                return {'message': 'Missing user_id or refresh token'}, 400

            # Check if a token already exists for the user
            existing_token = RefreshToken.query.filter_by(user_id=user_id).first()
            
            if existing_token:
                # Update the existing token
                existing_token.refresh_token = refresh_token
            else:
                # Create a new token record
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
        user_id = request.json.get('user_id')
        refresh_token = get_refresh_token_for_user(user_id)  # Implement this function

        if not refresh_token:
            return {'error': 'No refresh token found for user'}, 404

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
            return jsonify(response.json())
        else:
            return {'error': 'Failed to refresh token'}, response.status_code

class StoreUser(Resource):
    def post(self):
        data = request.get_json()
        # import ipdb; ipdb.set_trace()
        new_user = User(email=data['email'], name=data['name'],username=data['userId'] )
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201

    def options(self):
        # Handle OPTIONS request explicitly (if needed)
        return {'message': 'OK'}, 200

api.add_resource(StoreUser, '/store_user')
api.add_resource(Refresh, '/refresh_token')
api.add_resource(RefreshTokenResource, '/store_refresh_token')
#Routes
api.add_resource(TokenExchange, '/token-exchange')
api.add_resource(UserSavedTracks, '/user_saved_tracks')
api.add_resource(Authenticate, '/authenticate') #perhaps not needed
api.add_resource(Home, '/home')
api.add_resource(LoginPage, '/login')
api.add_resource(Redirect, '/redirect') #to sign in
api.add_resource(Logout, '/logout')


api.add_resource(CurrentUser, '/current_user')

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
    # CORS(app, resources={
    #     r"/store_refresh_token": {"origins": "http://localhost:5555"},
    #     r"/current_user": {"origins": "http://localhost:5555"},
    #     r"/store_user": {"origins": "http://localhost:5555"},
    # })    
    app.run(debug=True, port=5556)


