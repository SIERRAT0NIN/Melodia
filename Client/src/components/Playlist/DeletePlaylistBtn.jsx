import { Button } from "@nextui-org/react";
import { useSpotify } from "../Spotify/SpotifyContext";

function DeletePlaylistBtn({ playlistId }) {
  const { accessToken } = useSpotify();

  const deletePlaylist = async () => {
    if (!playlistId || !accessToken) {
      console.error("Playlist ID or Access Token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Playlist deleted (unfollowed) successfully");
        // You might want to add some logic here to update the UI
        // or inform the parent component about the deletion
      } else {
        console.error(
          "Error deleting (unfollowing) the playlist:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error in the delete operation:", error);
    }
  };

  return (
    <div>
      <Button color="danger" variant="bordered" onClick={deletePlaylist}>
        Delete Playlist
      </Button>
    </div>
  );
}

export default DeletePlaylistBtn;
