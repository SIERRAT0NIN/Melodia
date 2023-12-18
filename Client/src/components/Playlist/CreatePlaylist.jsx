import { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

// Note: Move client_secret and client_id to a secure backend service.
const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const { accessToken, userId, refreshToken, setAccessToken } = useSpotify();
  const [popoverMessage, setPopoverMessage] = useState("");

  const refreshAccessToken = async () => {
    const refresh_token = refreshToken;
    const authString = btoa(`${client_id}:${client_secret}`);
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
      setAccessToken(access_token);

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
      const newAccessToken = await refreshAccessToken();
      response = await makePlaylistRequest(newAccessToken);
    }

    if (response.ok) {
      const data = await response.json();
      console.log("Playlist created:", data);

      setPlaylistName("");
      setPlaylistDescription("");
      setPopoverMessage("Playlist has been created successfully");
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

  const handleAddToPlaylistClick = () => {
    createPlaylist();
    setPopoverMessage("Playlist has been created");
  };

  const popoverContent = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">{popoverMessage}</div>
      </div>
    </PopoverContent>
  );

  return (
    <div>
      <Input
        type="text"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        placeholder="Playlist Name"
        maxLength={20}
      />
      <br />
      <Input
        type="text"
        value={playlistDescription}
        onChange={(e) => setPlaylistDescription(e.target.value)}
        placeholder="Playlist Description"
      />
      <br />
      <Popover placement="top" color={"default"}>
        <PopoverTrigger>
          <Button className="bn30" onClick={handleAddToPlaylistClick}>
            Create a playlist.
          </Button>
        </PopoverTrigger>
        {popoverContent}
      </Popover>
    </div>
  );
}
