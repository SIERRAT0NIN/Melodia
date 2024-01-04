import React, { useState } from 'react';
import { useSpotify } from '../Spotify/SpotifyContext';
const CreateSpotifyPlaylist = ({ jwtUserId, songUris }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
    const { jwtUserId, }
  const createPlaylist = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setStatusMessage('Access Token is missing');
      return;
    }

    // Create a new playlist
    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${jwtUserId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New Playlist', description: 'Created from my app' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      const data = await response.json();
      setPlaylistId(data.id);
      setStatusMessage('Playlist created successfully!');
      addSongsToPlaylist(data.id);
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const addSongsToPlaylist = async (playlistId) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: songUris }),
      });

      if (!response.ok) {
        throw new Error('Failed to add songs to playlist');
      }

      setStatusMessage('Songs added to playlist successfully!');
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  return (
    <div>
      <button onClick={createPlaylist}>Create Playlist and Add Songs</button>
      {statusMessage && <p>{statusMessage}</p>}
      {playlistId && <p>Playlist ID: {playlistId}</p>}
    </div>
  );
};

export default CreateSpotifyPlaylist;
