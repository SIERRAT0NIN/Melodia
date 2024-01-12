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

const SongModal = ({ isOpen, onClose, songData }) => {
  const [popoverMessage, setPopoverMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { accessToken } = useSpotify();

  const [albumTracks, setAlbumTracks] = useState([]);

  // Function to fetch album tracks
  const fetchAlbumTracks = async (albumId) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching album tracks: ${response.status}`);
      }
      const data = await response.json();
      setAlbumTracks(data.items);
    } catch (error) {
      console.error("Error fetching album tracks:", error);
    }
  };

  useEffect(() => {
    if (!songData || !accessToken) return;

    const checkIfSongIsLiked = async () => {
      const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${songData.id}`;
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const isLikedArray = await response.json();
        setIsLiked(isLikedArray.length > 0 && isLikedArray[0]);
      } catch (error) {
        console.error("Error checking if song is liked:", error);
      }
    };

    checkIfSongIsLiked();
  }, [songData, accessToken]);
  useEffect(() => {
    if (isOpen && songData) {
      fetchAlbumTracks(songData.album.id);
    }
  }, [isOpen, songData, accessToken]);
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLikeUnlikeClick = async () => {
    try {
      const newIsLiked = !isLiked;
      await likeUnlikeSong(songData.id, newIsLiked);
      setIsLiked(newIsLiked);
      setPopoverMessage(
        newIsLiked ? "Song has been liked!" : "Song has been unliked!"
      );
    } catch (error) {
      console.error("Error in like/unlike action:", error);
    }
  };

  const popoverContent = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">{popoverMessage}</div>
      </div>
    </PopoverContent>
  );

  if (!songData) return null;
  const handleShowAlbumTracks = async (albumId, event) => {
    event.stopPropagation();
    await fetchAlbumTracks(albumId);
    setShowAlbumTracksModal(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior={"outside"}
    >
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
          <div>
            {songData &&
              songData.artists &&
              songData.artists.map((track, index) => (
                <div key={track.id || index}>
                  <strong>{track.name}</strong>
                </div>
              ))}
          </div>
          <div>
            <h3>
              <strong>Album Tracks:</strong>
            </h3>
            {albumTracks.map((track, index) => (
              <p key={track.id || index}>{track.name}</p>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center items-center">
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
