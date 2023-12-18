// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Button,
//   ModalFooter,
//   ModalHeader,
//   ModalBody,
//   Input,
// } from "@nextui-org/react";

// function EditPlaylistButton({
//   playlistId,
//   accessToken,
//   onPlaylistUpdated,
//   initialDetails,
// }) {
// const [isOpen, setIsOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (initialDetails) {
//       setTitle(initialDetails.name);
//       setDescription(initialDetails.description);
//     }
//   }, [initialDetails]);

//   const handleEdit = async () => {
//     console.log("handleEdit function called");

//     if (!playlistId || !accessToken) {
//       console.error("Playlist ID or Access Token is missing");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://api.spotify.com/v1/playlists/${playlistId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: title,
//             description: description,
//           }),
//         }
//       );

//       if (response.ok) {
//         console.log("Playlist updated successfully");
//         onPlaylistUpdated({ name: title, description: description });
//       } else {
//         console.error("Error updating the playlist:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error in the update operation:", error);
//     } finally {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Current state of isOpen: ", isOpen);
//   }, [isOpen]);

//   return (
//     <>
//       <Button
//         color="warning"
//         variant="bordered"
//         onClick={() => {
//           console.log("Edit button clicked, isOpen before setting: ", isOpen);
//           setIsOpen(true);
//           console.log("Edit button clicked, isOpen after setting: ", isOpen);
//         }}
//       >
//         Edit Playlist
//       </Button>

//       <Modal open={isOpen} onClose={() => setIsOpen(false)}>
//         <ModalHeader>Edit Playlist</ModalHeader>
//         <ModalBody>
//           <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
//             <Input
//               type="text"
//               label="Edit Name"
//               placeholder="Change the name of the playlist"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <Input
//               type="text"
//               label="Edit Description"
//               placeholder="Change the description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button auto flat color="error" onClick={() => setIsOpen(false)}>
//             Cancel
//           </Button>
//           <Button auto onClick={handleEdit}>
//             Save
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// }

// export default EditPlaylistButton;
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

function EditPlaylistButton({
  playlistId,
  accessToken,
  onPlaylistUpdated,
  initialDetails,
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
    <>
      <Button color="warning" variant="bordered" onClick={() => handleEdit()}>
        Edit Playlist
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>Edit Playlist</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <Button auto flat color="error" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button auto onClick={handleEdit}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default EditPlaylistButton;
