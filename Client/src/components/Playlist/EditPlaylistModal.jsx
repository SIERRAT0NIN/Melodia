import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

function EditPlaylistModal({
  playlistId,
  accessToken,
  onPlaylistUpdated,
  initialDetails,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialDetails) {
      setTitle(initialDetails.name);
      setDescription(initialDetails.description);
    }
  }, [initialDetails]);

  const handleEdit = async () => {
    console.log("handleEdit function called");

    if (!playlistId || !accessToken) {
      console.error("Playlist ID or Access Token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: title,
            description: description,
          }),
        }
      );

      if (response.ok) {
        console.log("Playlist updated successfully");
        onPlaylistUpdated({ name: title, description: description });
      } else {
        console.error("Error updating the playlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error in the update operation:", error);
    } finally {
      setIsOpen(false); // Close the modal after updating
    }
  };

  return (
    <div>
      <Input
        type="text"
        label="Edit Name"
        placeholder="Change the name of the playlist"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        label="Edit Description"
        placeholder="Change the description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button auto flat color="error" onPress={onClose}>
        Cancel
      </Button>
      <Button auto onClick={handleEdit}>
        Save
      </Button>
    </div>
  );
}

export default EditPlaylistModal;
