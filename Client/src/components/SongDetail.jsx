import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { useState } from "react";

const SongModal = ({ isOpen, onClose, songData }) => {
  if (!songData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} /* other props */>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <Image src={songData.album.images[1].url} alt={songData.name} />
          <h2>{songData.name}</h2>
          <h4>{songData.artists.map((artist) => artist.name).join(", ")}</h4>
          <h4>{songData.album.name}</h4>
        </ModalHeader>
        <ModalBody>
          <p>Release Date: {songData.album.release_date}</p>
          {/* <p>Artist Bio: {songData.artistBio}</p> */}
          <p>Popularity: {songData.popularity}</p>
        </ModalBody>
        <ModalFooter>
          <a href="/buttons/9">
            <button className="bn9">
              <span>Add to playlist</span>
            </button>
          </a>
          <a href="/buttons/9">
            <button className="bn9">
              <span>Like</span>
            </button>
          </a>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SongModal;
