import { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

export default function CreatePlaylist({ image, setImage }) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const { jwtUserId } = useSpotify();
  const [popoverMessage, setPopoverMessage] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const getNewAccessToken = async () => {};

  const createPlaylist = async () => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !jwtUserId) {
      console.error("Access Token or User ID is missing");
      setPopoverMessage("Missing access token or user ID");
      return;
    }

    let response = await makePlaylistRequest(accessToken);

    if (!response.ok && response.status === 401) {
      accessToken = await getNewAccessToken();
      response = await makePlaylistRequest(accessToken);
    }

    if (response.ok) {
      const data = await response.json();
      console.log("Playlist created:", data);
      setPlaylistName("");
      setPlaylistDescription("");
      setPopoverMessage("Playlist has been created successfully");
    } else {
      console.error("Error creating playlist:", response.statusText);
      setPopoverMessage("Failed to create playlist");
    }
  };

  const makePlaylistRequest = async (accessToken) => {
    return await fetch(
      `https://api.spotify.com/v1/users/${jwtUserId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
        }),
      }
    );
  };

  const handleAddToPlaylistClick = async () => {
    if (!playlistName.trim() || !playlistDescription.trim()) {
      setPopoverMessage(
        "Please enter both a name and description for the playlist."
      );
      return;
    }

    setPopoverMessage("");
    setCreatingPlaylist(true);

    try {
      await createPlaylist();
    } catch (error) {
      console.error("Error creating playlist:", error);
      setPopoverMessage("An error occurred while creating the playlist.");
    } finally {
      setCreatingPlaylist(false);
    }
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
      <Input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Playlist Image"
      />
      <br />
      <Popover placement="top" color={"default"}>
        <PopoverTrigger>
          <Button
            className="bn30"
            onClick={handleAddToPlaylistClick}
            disabled={creatingPlaylist}
          >
            {creatingPlaylist ? "Creating..." : "Create a playlist."}
          </Button>
        </PopoverTrigger>
        {popoverContent}
      </Popover>
    </div>
  );
}
