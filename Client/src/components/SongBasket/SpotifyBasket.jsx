import React, { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
const CreateSpotifyPlaylist = ({ songUris, name, description, image }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const { jwtUserId, playlistName } = useSpotify();
  const createPlaylist = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setStatusMessage("Access Token is missing");
      return;
    }

    try {
      // Step 1: Create a new playlist
      const createResponse = await fetch(
        `https://api.spotify.com/v1/users/${jwtUserId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test",
            description: "Test description sent form <SpotifyBasket />",
          }),
        }
      );

      if (!createResponse.ok) throw new Error("Failed to create playlist");

      const playlistData = await createResponse.json();
      setPlaylistId(playlistData.id);
      setStatusMessage("Playlist created successfully!");

      // Step 2: Add songs to the playlist
      const addSongsResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: songUris }),
        }
      );

      if (!addSongsResponse.ok)
        throw new Error("Failed to add songs to playlist");

      setStatusMessage("Songs added to playlist successfully!");
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
