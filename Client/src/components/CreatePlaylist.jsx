import { useState } from "react";
import { useSpotify } from "./SpotifyContext";
import { Input } from "@nextui-org/react";

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const { accessToken, userId, refreshToken } = useSpotify();
  const createPlaylist = async () => {
    if (!accessToken || !userId) {
      console.error("Access Token or User ID is missing");
      return;
    }
    console.log("refresh token:", refreshToken);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
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
      <Input
        type="text"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        placeholder="Playlist Name"
        maxLength={"20px"}
      />
      <br />
      <Input
        type="text"
        value={playlistDescription}
        onChange={(e) => setPlaylistDescription(e.target.value)}
        placeholder="Playlist Description"
      />
      <br />
      <button className="bn30" onClick={createPlaylist}>
        Create a Playlist
      </button>
    </div>
  );
}
