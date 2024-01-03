import React, { useState, useEffect } from "react";
import SongBasket from "./SongBasket";
import { CreateSongBasket } from "./CreateSongBasket";
import VerifyJWT from "../Spotify/VerifyJWT";
import { useSpotify } from "../Spotify/SpotifyContext";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import NavBar from "../Home/NavBar";
import CreatePlaylist from "../Playlist/CreatePlaylist";

function BasketCollection({ setSongCount, songCount }) {
  const { jwtUserId } = useSpotify();
  const [basketData, setBasketData] = useState([]);
  const [currentBasketId, setCurrentBasketId] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadSongBasket = () => {
    fetch(`http://localhost:5556/song_basket/${jwtUserId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Basket Data: ", data);
        setBasketData(data);
        setSongCount(data.songs.length); // Update song count based on fetched data
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const removeSongFromBasket = (basketId, songId) => {
    fetch(
      `http://localhost:5556/song_basket/${jwtUserId}/${basketId}/${songId}`,
      { method: "DELETE" }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove song");
        }
        return response.json();
      })
      .then(() => {
        // Update local state to reflect the change
        setBasketData((currentData) =>
          currentData.map((basket) => {
            if (basket.basket_id === basketId) {
              return {
                ...basket,
                songs: basket.songs.filter((song) => song.id !== songId),
              };
            }
            return basket;
          })
        );
      })
      .catch((error) => console.error("Error removing song:", error));
  };

  useEffect(() => {
    loadSongBasket();
  }, [jwtUserId]);

  const showModal = (basketId) => {
    setCurrentBasketId(basketId);
    onOpen();
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  console.log("Basket Data:", basketData);
  return (
    <div>
      <NavBar />
      <VerifyJWT />
      <div>
        <CreateSongBasket
          loadSongBasket={loadSongBasket}
          setSongCount={setSongCount}
          songCount={songCount}
        />
      </div>
      <div className="glassmorphism-basket">
        {basketData.map((basket, index) => (
          <div key={basket.basket_id}>
            <h3>Basket ID: {basket.basket_id}</h3>
            <Table striped aria-label="Song Basket Table">
              <TableHeader>
                <TableColumn aria-label="Song Column">Song</TableColumn>
                <TableColumn aria-label="Artist Column">Artist</TableColumn>
                <TableColumn aria-label="Image Column"></TableColumn>
              </TableHeader>
              <TableBody>
                {basket.songs.length > 0 ? (
                  basket.songs.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell>
                        <button
                          className="rm-song"
                          onClick={() =>
                            removeSongFromBasket(
                              basket.basket_id,
                              song.track_id
                            )
                          }
                        >
                          Remove song from song basket
                        </button>
                        {song.track_name}
                      </TableCell>
                      <TableCell>
                        {song.track_artist || "Unknown Artist"}
                      </TableCell>
                      <TableCell>
                        <Image
                          className="basket-img"
                          src={song.track_image}
                          isBlurred
                        ></Image>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No songs in basket</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <button className="bn5" onClick={() => showModal(basket.basket_id)}>
              Create into a Spotify Playlist
            </button>
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Spotify Playlist</ModalHeader>
              <ModalBody>
                <p>Creating playlist for Basket ID: {currentBasketId}</p>
                <CreatePlaylist />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default BasketCollection;
