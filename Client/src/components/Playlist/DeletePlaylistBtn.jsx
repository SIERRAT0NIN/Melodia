import { Button } from "@nextui-org/react";

function DeletePlaylistBtn({ accessToken }) {
  const deletePlaylist = async (playlistId, accessToken) => {
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
      {/* <a href="/"> */}
      <Button color="danger" variant="bordered" onClick={deletePlaylist}>
        Delete Playlist
      </Button>
      {/* </a> */}
    </div>
  );
}

export default DeletePlaylistBtn;
