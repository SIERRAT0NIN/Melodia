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

import AddSongs from "./AddSongs";
import BasketSearchModal from "./BasketSearchModal";
import EditBasketModal from "./EditBasketModal";
import CreateSpotifyPlaylist from "./SpotifyBasket";

function BasketCollection({ setSongCount, songCount }) {
  const {
    jwtUserId,
    selectedBasketId,
    setSelectedBasketId,
    playlistName,
    playlistDescription,
  } = useSpotify();
  const [basketData, setBasketData] = useState([]);
  const [currentBasketId, setCurrentBasketId] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showSpotifySearch, setShowSpotifySearch] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBasketInfo, setCurrentBasketInfo] = useState({});
  const [name, setName] = useState(currentBasketInfo.playlist_name);
  const [description, setDescription] = useState(
    currentBasketInfo.playlist_description
  );
  const [image, setImage] = useState(currentBasketInfo.playlist_img);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  const handleSongToBasket = (basket_id, songs) => {
    setBasketData((currentBaskets) =>
      currentBaskets.map((basket) => {
        if (basket.basket_id === basket_id) {
          return { ...basket, songs: [...basket.songs, ...songs] };
        } else return basket;
      })
    );
  };
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

  function deleteBasket(basketId) {
    fetch(`http://localhost:5556/delete_basket/${jwtUserId}/${basketId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        loadSongBasket();
      })
      .catch((error) => {
        console.error("Error deleting basket:", error);
      });
  }

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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const openSpotifySearch = (basketId) => {
    setSelectedBasketId(basketId);
    setShowSpotifySearch(true);
  };

  const openSearchModal = (basketId) => {
    setSelectedBasketId(basketId); // Set the selected basket ID
    setIsSearchModalOpen(true); // Open the modal
  };

  // Function to close the BasketSearchModal
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };
  function removeSongFromBasket(basketId, songId) {
    fetch(
      `http://localhost:5556/song_basket/${jwtUserId}/${basketId}/${songId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        loadSongBasket();
      })
      .catch((error) => {
        console.error("Error removing song:", error);
      });
  }
  const onSearchModalClose = () => setShowSpotifySearch(false);

  const updateBasket = (basketId, updatedData) => {
    return fetch(`http://localhost:5556/song_basket/${jwtUserId}/${basketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(updatedData),
    });
  };
  const openEditModal = (basket) => {
    setCurrentBasketInfo(basket); // Set the information of the basket to be edited
    setIsEditModalOpen(true); // Open the Edit Modal
  };
  const uris = basketData
    .map((basket) => basket.songs.map((song) => song.track_uri))
    .flat();

  return (
    <div>
      <NavBar />
      <VerifyJWT />
      <div className="flex justify-center">
        <CreateSongBasket
          loadSongBasket={loadSongBasket}
          setSongCount={setSongCount}
          songCount={songCount}
        />
      </div>
      <div className="glassmorphism-basket">
        {basketData.map((basket, index) => (
          <div key={basket.basket_id}>
            <Image src={basket.playlist_img}></Image>
            <div className="deletebasket flex justify-center">
              <h3>Basket ID: {basket.basket_id}</h3>

              <h2>Name: {basket.playlist_name}</h2>

              <h3>Description: {basket.playlist_description}</h3>
            </div>
            <div className=" flex justify-center">
              <button
                className="bn54 "
                onClick={() => openSearchModal(basket.basket_id)}
              >
                <span className="bn54span">Add songs</span>
              </button>
              <button className="bn54" onClick={() => openEditModal(basket)}>
                <span className="bn54span">Edit Basket </span>
              </button>
              <AddSongs
                handleSongToBasket={handleSongToBasket}
                isOpen={isOpen}
                onClose={onSearchModalClose}
              />
              <BasketSearchModal
                isOpen={isSearchModalOpen}
                onClose={closeSearchModal}
                basketId={selectedBasketId}
              />
              <EditBasketModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                basketInfo={currentBasketInfo}
                updateBasket={updateBasket}
                jwtUserId={jwtUserId}
                loadSongBasket={loadSongBasket}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                image={image}
                setImage={setImage}
              />
            </div>
            <Table striped aria-label="Song Basket Table">
              <TableHeader>
                <TableColumn aria-label="Song Column">Song</TableColumn>
                {/* <TableColumn aria-label="Artist Column">Artist</TableColumn>
                <TableColumn aria-label="Image Column"></TableColumn> */}
              </TableHeader>
              <TableBody>
                {basket.songs.length > 0 ? (
                  basket.songs.map((song) => (
                    <TableRow key={song.track_id}>
                      <TableCell>
                        <Button
                          className="rm-song"
                          onClick={() =>
                            removeSongFromBasket(basket.basket_id, song.id)
                          }
                        >
                          Remove
                        </Button>
                        {song.track_name}
                      </TableCell>
                      {/* <TableCell>
                        {song.track_artist || "Unknown Artist"}
                      </TableCell>
                      <TableCell>
                        <Image
                          className="basket-img"
                          src={song.track_image}
                          isBlurred
                        ></Image>
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No songs in basket</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-center ">
              <button
                className="bn54 deletebasket"
                onClick={() => deleteBasket(basket.basket_id)}
              >
                <span className="bn54span">Delete basket</span>
              </button>
            </div>
            {/* <button className="bn5" onClick={() => showModal(basket.basket_id)}>
              Create into a Spotify Playlist
            </button> */}
            <CreateSpotifyPlaylist
              songUris={uris}
              name={name}
              description={description}
              image={image}
            />
          </div>
        ))}
      </div>
      {/* {showSpotifySearch && (
        <AddSongs
          basketId={selectedBasketId}
          onClose={() => setShowSpotifySearch(false)}
        />
      )} */}
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Spotify Playlist</ModalHeader>
              <ModalBody>
                <p>Creating playlist for Basket ID: {currentBasketId}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </div>
  );
}

export default BasketCollection;
