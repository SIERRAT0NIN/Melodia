import { useState } from "react";
import SongBasket from "./SongBasket";
import { useSpotify } from "../Spotify/SpotifyContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

export const CreateSongBasket = ({
  loadSongBasket,
  songCount,
  setSongCount,
}) => {
  const {
    setSelectedBasketId,
    jwtUserId,
    setPlaylistName,
    setPlaylistDescription,
    playlistDescription,
    playlistName,
    basketId,
    playlistImage,
    setPlaylistImage,
  } = useSpotify(null);
  const [songBaskets, setSongBaskets] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const createSongBasketInBackend = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    try {
      const response = await fetch("http://localhost:5556/create_song_basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: jwtUserId,
          playlist_name: playlistName,
          playlist_description: playlistDescription,
          basket_id: basketId,
          playlist_img: playlistImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("New Song Basket Created with ID:", data.basket_id);
      return data.basket_id;
    } catch (error) {
      console.error("Error creating song basket:", error);
      return null;
    }
  };
  const handleAddSongBasket = async () => {
    const basketId = await createSongBasketInBackend();
    if (basketId) {
      setSongBaskets([...songBaskets, { id: basketId }]);
      setSelectedBasketId(basketId);
      setIsModalVisible(false); // Close the modal after creation
      setPlaylistName(""); // Reset the form
      setPlaylistDescription("");
      loadSongBasket(); // Load the newly created basket
    }
  };
  console.log(playlistDescription);
  console.log(playlistName);
  return (
    <div>
      <Button
        variant="shadow"
        color="secondary"
        onClick={() => setIsModalVisible(true)}
      >
        Create a new song basket
      </Button>

      <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <ModalContent>
          <ModalHeader>Create New Playlist</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Basket Name"
              maxLength={20}
            />
            <Input
              type="text"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              placeholder="Basket Description"
            />
            <Input
              type="text"
              value={playlistImage}
              onChange={(e) => setPlaylistImage(e.target.value)}
              placeholder="Basket Image"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalVisible(false)}>Close</Button>
            <Button onClick={handleAddSongBasket}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {songBaskets.map((basket) => (
        <SongBasket
          key={basket.id}
          id={basket.id}
          loadSongBasket={loadSongBasket}
          songCount={songCount}
          setSongCount={setSongCount}
        />
      ))}
    </div>
  );
};
