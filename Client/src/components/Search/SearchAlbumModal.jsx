import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";

const SearchAlbumModal = ({ isOpen, onClose, songData, scrollBehavior }) => {
  if (!songData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior={scrollBehavior}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col justify-center items-center gap-1">
          <Image
            isBlurred
            src={songData.images[0].url}
            sizes="lg"
            alt={songData.name}
          />

          <h4>{songData.name}</h4>
        </ModalHeader>
        <ModalBody className="modal-body-content">
          <p>Release Date: {songData.release_date}</p>
          <p>Popularity: {songData.popularity}</p>
          <p>Genres: {songData.genre}</p>
        </ModalBody>
        <ModalFooter className="flex justify-center items-center"></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SongModal;
