// import React, { useState } from "react";
// import { useSpotify } from "../Spotify/SpotifyContext";
// const CreateSpotifyPlaylist = ({ songUris, name, description, image }) => {
//   const [playlistId, setPlaylistId] = useState(null);
//   const [statusMessage, setStatusMessage] = useState("");
//   const { jwtUserId, playlistName } = useSpotify();
//   const createPlaylist = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setStatusMessage("Access Token is missing");
//       return;
//     }

//     try {
//       // Step 1: Create a new playlist
//       const createResponse = await fetch(
//         `https://api.spotify.com/v1/users/${jwtUserId}/playlists`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: "Test",
//             description: "Test description sent form <SpotifyBasket />",
//           }),
//         }
//       );

//       if (!createResponse.ok) throw new Error("Failed to create playlist");

//       const playlistData = await createResponse.json();
//       setPlaylistId(playlistData.id);
//       setStatusMessage("Playlist created successfully!");

//       // Step 2: Add songs to the playlist
//       const addSongsResponse = await fetch(
//         `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ uris: songUris }),
//         }
//       );
//       const addPlaylistImg = await fetch(
//         `https://api.spotify.com/v1/playlists/${playlistData.id}/images`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ image: image }),
//         }
//       );

//       if (!addSongsResponse.ok)
//         throw new Error("Failed to add songs to playlist");

//       setStatusMessage("Songs added to playlist successfully!");
//     } catch (error) {
//       setStatusMessage(error.message);
//     }
//   };

//   return (
//     <div>
//       <button className="bn5" onClick={createPlaylist}>
//         Create Playlist and Add Songs
//       </button>
//       {statusMessage && <p>{statusMessage}</p>}
//       {playlistId && <p>Playlist ID: {playlistId}</p>}
//     </div>
//   );
// };

// export default CreateSpotifyPlaylist;
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";

const CreateSpotifyPlaylist = ({
  songUris,
  name,
  description,
  image,
  basketData,
}) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const { jwtUserId } = useSpotify();

  // Convert Image to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const createPlaylist = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setStatusMessage("Access Token is missing");
      return;
    }

    console.log(basketData);
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
            name: basketData[0].playlist_name,
            description: basketData[0].playlist_description,
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

      // Step 3: Update playlist image (if image is provided)
      if (image) {
        const base64Image = await convertImageToBase64(image);

        const updateImageResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistData.id}/images`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "image/jpeg",
            },
            body: JSON.stringify({ image: base64Image }),
          }
        );

        if (!updateImageResponse.ok)
          throw new Error("Failed to update playlist image");
      }

      setStatusMessage("Playlist updated successfully!");
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  return (
    <div>
      <Button
        color="success"
        variant="solid"
        onClick={createPlaylist}
        size="lg"
        className="create-pl"
      >
        Create Playlist and Add Songs
      </Button>
      {statusMessage && <p>{statusMessage}</p>}
      {playlistId && <p>Playlist ID: {playlistId}</p>}
    </div>
  );
};

export default CreateSpotifyPlaylist;
