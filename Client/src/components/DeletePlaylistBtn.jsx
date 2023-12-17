import React from "react";

function DeletePlaylistBtn() {
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
      <a href="/">
        <button className="bn632-hover bn19" onClick={deletePlaylist}>
          Delete Playlist
        </button>
      </a>
    </div>
  );
}

export default DeletePlaylistBtn;
