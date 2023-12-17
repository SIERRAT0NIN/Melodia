import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import { useState } from "react";

const SongModal = ({ isOpen, onClose, songData }) => {
  const [popoverMessage, setPopoverMessage] = useState("");

  if (!songData) return null;

  const handleLikeClick = () => {
    setPopoverMessage("Liked! This song has been added to your saved songs.");
  };

  const handleAddToPlaylistClick = () => {
    setPopoverMessage("Song added to playlist.");
  };

  const popoverContent = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">{popoverMessage}</div>
      </div>
    </PopoverContent>
  );

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
          <Popover placement="top" color={"default"}>
            <PopoverTrigger>
              <Button className="bn30" onClick={handleAddToPlaylistClick}>
                Add to playlist.
              </Button>
            </PopoverTrigger>
            {popoverContent}
          </Popover>
          <Popover placement="top" color={"success"}>
            <PopoverTrigger>
              <Button className="bn9" onClick={handleLikeClick}>
                Like
              </Button>
            </PopoverTrigger>
            {popoverContent}
          </Popover>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SongModal;
