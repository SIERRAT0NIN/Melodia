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

const SearchAlbumModal = ({ isOpen, onClose, albumData, scrollBehavior }) => {
  if (!albumData) return null;

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
            src={albumData.images[0].url}
            sizes="lg"
            alt={albumData.name}
          />

          <h4>{albumData.name}</h4>
        </ModalHeader>
        <ModalBody className="modal-body-content">
          <p> {albumData.type}</p>
          <p>Release Date: {albumData.release_date}</p>
          <p>Total Tracks: {albumData.total_tracks}</p>
        </ModalBody>
        <ModalFooter className="flex justify-center items-center"></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchAlbumModal;
