import { useState } from "react";
import { useSpotify } from "./SpotifyContext";

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const { accessToken, userId } = useSpotify(); // Use useSpotify hook to access userId and accessToken

  const createPlaylist = async () => {
    if (!accessToken || !userId) {
      console.error("Access Token or User ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json(); // Fixed to await response.json() instead of console.log
        console.log("Playlist created:", data);
      } else {
        console.error("Error creating playlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <button className="bn30" onClick={createPlaylist}>
        Create a Playlist
      </button>
    </div>
  );
}
