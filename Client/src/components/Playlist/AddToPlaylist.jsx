import { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext"; // assuming this is the path to your SpotifyContext
import { Select } from "@nextui-org/react";

const AddToPlaylist = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const { accessToken, userPlaylists, selectedSong } = useSpotify();

  const handlePlaylistChange = (value) => {
    setSelectedPlaylistId(value);
  };

  const addSongToPlaylist = async () => {
    if (!selectedSong || !selectedPlaylistId) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [selectedSong.uri],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert("Song added to playlist successfully!");
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      alert("Failed to add song to playlist.");
    }
  };

  return (
    <div>
      <h3>Add Song to Playlist</h3>
      <Select
        placeholder="Select a Playlist"
        onChange={handlePlaylistChange}
        value={selectedPlaylistId}
      >
        {userPlaylists.map((playlist) => (
          <Select.Option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default AddToPlaylist;
