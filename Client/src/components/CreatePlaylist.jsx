import { useState } from "react";
import { useSpotify } from "./SpotifyContext";
import { Input } from "@nextui-org/react";

const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const { accessToken, userId, refreshToken, setAccessToken } = useSpotify();

  const refreshAccessToken = async () => {
    const refresh_token = refreshToken; // Assuming refreshToken is correctly retrieved
    const authString = btoa(`${client_id}:${client_secret}`); // Ensure these are securely managed
    const url = "https://accounts.spotify.com/api/token";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const { access_token } = data;

      setAccessToken(access_token); // Update access token state

      // Handle new refresh token if provided
      // if (new_refresh_token) storeRefreshToken(new_refresh_token);

      return access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  };
  const createPlaylist = async () => {
    if (!accessToken || !userId) {
      console.error("Access Token or User ID is missing");
      return;
    }

    let response = await makePlaylistRequest(accessToken);

    if (!response.ok && response.status === 401) {
      // Token might be expired, try refreshing it
      const newAccessToken = await refreshAccessToken();
      // Retry the request with the new access token
      response = await makePlaylistRequest(newAccessToken);
    }

    if (response.ok) {
      const data = await response.json();
      console.log("Playlist created:", data);
    } else {
      console.error("Error creating playlist:", response.statusText);
    }
  };

  const makePlaylistRequest = async (token) => {
    return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: playlistDescription,
      }),
    });
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
