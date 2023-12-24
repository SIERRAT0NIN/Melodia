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

const SongModal = ({ isOpen, onClose, songData }) => {
  const [popoverMessage, setPopoverMessage] = useState("");
  const [isLiked, setIsLiked] = useState(true);
  const { accessToken } = useSpotify();

  if (!songData) return null;

  const handleLikeUnlikeClick = () => {
    likeUnlikeSong(songData.id, isLiked)
      .then(() => {
        setIsLiked(!isLiked);
        setPopoverMessage("Song has been liked!");
      })
      .catch((error) => console.error(error));
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

  const likeUnlikeSong = async (songId, isLiked) => {
    if (!accessToken) {
      console.error("Access Token is not available.");
      return;
    }

    const requestOptions = {
      method: isLiked ? "DELETE" : "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [songId] }),
    };

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/tracks",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to update song like status");
      }
      // Update the state if needed, e.g., refresh the list of liked songs
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col justify-center items-center gap-1">
          <Image
            isBlurred
            src={songData.album.images[1].url}
            sizes="xl"
            alt={songData.name}
          />

          <h2>{songData.name}</h2>
          <h4>{songData.artists.map((artist) => artist.name).join(", ")}</h4>
          <h4>{songData.album.name}</h4>
        </ModalHeader>
        <ModalBody>
          <p>Release Date: {songData.album.release_date}</p>
          <p>Popularity: {songData.popularity}</p>
        </ModalBody>
        <ModalFooter className="flex justify-center items-center">
          <Popover placement="top" color={"default"}>
            <PopoverTrigger>
              <Button className="bn30" onClick={handleAddToPlaylistClick}>
                Add to playlist
              </Button>
            </PopoverTrigger>
            {popoverContent}
          </Popover>
          <Popover placement="top" color={isLiked ? "error" : "success"}>
            <PopoverTrigger>
              <Button className="bn30" onClick={handleLikeUnlikeClick}>
                {isLiked ? "Unlike" : "Like"}
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
