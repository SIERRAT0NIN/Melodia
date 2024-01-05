import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import SpotifySearch from "../Search/SpotifySearch";

export default function AddSongs({
  isOpen,
  onClose,
  basketId,
  handleSongToBasket,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Add songs to your Song Basket!
        </ModalHeader>
        <ModalBody>
          <p>Search for songs/albums</p>
          <SpotifySearch
            handleSongToBasket={handleSongToBasket}
            basketId={basketId}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
