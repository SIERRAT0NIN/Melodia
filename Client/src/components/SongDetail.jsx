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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      radius="2x1"
      classNames={{
        body: "py-6",
        base: "border-[#292f46] dark:bg-[#19172c] text-[#000]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <Image
            className="flex"
            src={songData.image}
            alt={songData.name}
          ></Image>
          <h2>{songData.name}</h2>
          <h4>{songData.artist}</h4>
          <h4>{songData.album}</h4>
        </ModalHeader>
        <ModalBody>
          <p>Release Data: {songData.releaseDate}</p>
          <p>Artist Bio: {songData.artistBio}</p>
          <p>Popularity: {songData.popularity}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="foreground" variant="light" onClick={onClose}>
            Like
          </Button>
          <Button color="success" variant="light" onClick={onClose}>
            Add to playlist
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSong, setCurrentSong] = useState(null);

  // Simulated song data
  const songData = {
    name: "Cowgirl (feat. Lourdiz)",
    artist: "Nicki Minaj",
    album: "Pink Friday 2",
    releaseDate: "2023-12-08",
    artistBio: "Artist bio goes here...",
    popularity: "High",
    image: "https://i.scdn.co/image/ab67616d00001e02651e1dbc0b5218f2306181a1",
  };

  const openModal = () => {
    setCurrentSong(songData);
    onOpen();
  };

  return (
    <>
      <Button onClick={openModal} color="success">
        Song
      </Button>
      <SongModal isOpen={isOpen} onClose={onClose} songData={currentSong} />
    </>
  );
};

export default App;
