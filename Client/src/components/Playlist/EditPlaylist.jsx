// export default EditPlaylistButton;
import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import EditPlaylistModal from "./EditPlaylistModal";

function EditPlaylistButton({
  playlistId,
  accessToken,
  onPlaylistUpdated,
  initialDetails,
  onClose,
}) {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   if (initialDetails) {
  //     setTitle(initialDetails.name);
  //     setDescription(initialDetails.description);
  //   }
  // }, [initialDetails]);

  // const handleEdit = async () => {
  //   console.log("handleEdit function called");

  //   if (!playlistId || !accessToken) {
  //     console.error("Playlist ID or Access Token is missing");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://api.spotify.com/v1/playlists/${playlistId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: title,
  //           description: description,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       console.log("Playlist updated successfully");
  //       onPlaylistUpdated({ name: title, description: description });
  //     } else {
  //       console.error("Error updating the playlist:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error in the update operation:", error);
  //   } finally {
  //     setIsOpen(false); // Close the modal after updating
  //   }
  // };

  return (
    <div>
      <EditPlaylistModal
        playlistId={playlistId}
        accessToken={accessToken}
        onPlaylistUpdated={onPlaylistUpdated}
        initialDetails={initialDetails}
        onClose={onClose}
      />
    </div>
  );
}

export default EditPlaylistButton;
