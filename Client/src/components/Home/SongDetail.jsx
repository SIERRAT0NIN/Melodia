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
import { useState, useEffect } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";

const SongModal = ({ isOpen, onClose, songData, onAddToPlaylist }) => {
  const [popoverMessage, setPopoverMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false); // Default to false, assuming not liked initially
  const { accessToken } = useSpotify();

  if (!songData) return null;

  const handleLikeUnlikeClick = async () => {
    try {
      const newIsLiked = !isLiked;
      await likeUnlikeSong(songData.id, newIsLiked);
      setIsLiked(newIsLiked); // Update the like state
      setPopoverMessage(
        newIsLiked ? "Song has been liked!" : "Song has been unliked!"
      );
    } catch (error) {
      console.error("Error in like/unlike action:", error);
    }
  };

  const likeUnlikeSong = async (songId, shouldBeLiked) => {
    if (!accessToken) {
      console.error("Access Token is not available.");
      return;
    }

    const requestOptions = {
      method: shouldBeLiked ? "PUT" : "DELETE",
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

  const handleAddToPlaylistClick = () => {
    onAddToPlaylist(); // Call the passed callback function
    setPopoverMessage("Choose a playlist");
  };

  const popoverContent = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">{popoverMessage}</div>
      </div>
    </PopoverContent>
  );

  useEffect(() => {
    const checkIfSongIsLiked = async () => {
      if (!songData || !accessToken) return;

      const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${songData.id}`;
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const isLikedArray = await response.json();
        if (isLikedArray.length > 0) {
          setIsLiked(isLikedArray[0]); // Assuming the response is an array with one element
        }
      } catch (error) {
        console.error("Error checking if song is liked:", error);
      }
    };

    checkIfSongIsLiked();
  }, [songData, accessToken]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col justify-center items-center gap-1">
          <Image
            isBlurred
            src={songData.album.images[1].url}
            sizes="lg"
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
