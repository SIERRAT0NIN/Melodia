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

const SongModal = ({ isOpen, onClose, song }) => {
  const [popoverMessage, setPopoverMessage] = useState("");
  const [isLiked, setIsLiked] = useState(true);
  const { accessToken } = useSpotify();

  if (!song) return null;

  const handleLikeUnlikeClick = () => {
    likeUnlikeSong(song.id, isLiked)
      .then(() => {
        setIsLiked(!isLiked);
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
        <ModalHeader className="flex flex-col gap-1">
          <Image
            isBlurred
            src={song.album.images[1].url}
            sizes="lg"
            alt={song.name}
          />

          <h2>{song.name}</h2>
          <h4>{song.artists.map((artist) => artist.name).join(", ")}</h4>
          <h4>{song.album.name}</h4>
        </ModalHeader>
        <ModalBody>
          <p>Release Date: {song.album.release_date}</p>
          <p>Popularity: {song.popularity}</p>
        </ModalBody>
        <ModalFooter>
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
