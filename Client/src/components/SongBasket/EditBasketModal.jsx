import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

const EditBasketModal = ({
  isOpen,
  onClose,
  basketInfo,
  updateBasket,
  jwtUserId,
  loadSongBasket,
}) => {
  const [name, setName] = useState(basketInfo.playlist_name);
  const [description, setDescription] = useState(
    basketInfo.playlist_description
  );
  const [image, setImage] = useState(basketInfo.playlist_img);

  const handleUpdate = () => {
    const updatedData = {
      playlist_name: name,
      playlist_description: description,
      playlist_img: image,
    };

    fetch(
      `http://localhost:5556/song_basket/${jwtUserId}/${basketInfo.basket_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        loadSongBasket(); // Reload to show updated data
        onClose(); // Close the modal after successful update
      })
      .catch((error) => {
        console.error("Error updating basket:", error);
      });
  };

  useEffect(() => {
    setName(basketInfo.playlist_name);
    setDescription(basketInfo.playlist_description);
    setImage(basketInfo.playlist_img);
  }, [basketInfo]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Edit Basket</ModalHeader>
      <ModalBody>
        <Input
          label="Basket Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Basket Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Basket Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBasketModal;
