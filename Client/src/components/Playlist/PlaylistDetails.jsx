import { useEffect, useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import DeletePlaylistBtn from "./DeletePlaylistBtn";
import EditPlaylistModal from "./EditPlaylist";
import SongModal from "./PlaylistSongDetail";

//! PLAYLISTDETAILS
export default function PlaylistDetails({
  playlist,
  isOpen,
  onClose,
  setPlaylists,
}) {
  const { accessToken, selectedSong, setSelectedSong } = useSpotify();
  const [trackList, setTrackList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // const [playlistDetails, setPlaylistDetails] = useState(playlist);

  // Constants for fallback values
  const DEFAULT_PLAYLIST_IMAGE_URL = "default_playlist_image_url";
  const DEFAULT_PLAYLIST_NAME = "Playlist Name";
  const DEFAULT_DESCRIPTION = "No description available.";
  const DEFAULT_TRACK_COUNT = "N/A";

  const { name, description, images, id } = playlist ?? {};
  const imageUrl = images?.[0]?.url ?? DEFAULT_PLAYLIST_IMAGE_URL;

  useEffect(() => {
    const fetchTracks = async (url) => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTrackList((prevTracks) => [...prevTracks, ...data.items]);
          if (data.next) {
            fetchTracks(data.next);
          }
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        // Handle the error appropriately here
      }
    };

    if (isOpen && playlist?.tracks?.href && accessToken) {
      setTrackList([]);
      fetchTracks(playlist.tracks.href);
    }
  }, [playlist, isOpen, accessToken]);

  const onPlaylistUpdated = (updatedDetails) => {
    // Call setPlaylists to update the state in the parent component with the updated playlist details
    setPlaylists((prevPlaylists) => {
      return prevPlaylists.map((pl) => {
        if (pl.id === updatedDetails.id) {
          // Return the playlist with updated details
          return {
            ...pl,
            name: updatedDetails.name,
            description: updatedDetails.description,
          };
        }
        // Return the playlist as is if it's not the one that was updated
        return pl;
      });
    });
  };
  const handleSongClick = (song) => {
    setSelectedSong(song);
  };
  const isSongModalOpen = selectedSong != null;

  const closeSongModal = () => {
    setSelectedSong(null);
  };
  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      className="flex"
      scrollBehavior={"inside"}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2>{name ?? DEFAULT_PLAYLIST_NAME}</h2>
        </ModalHeader>

        <ModalBody>
          <Image isBlurred src={imageUrl} />
          <p>{description ?? DEFAULT_DESCRIPTION}</p>
          <p>Total Tracks: {trackList.length ?? DEFAULT_TRACK_COUNT}</p>
          <ul>
            {trackList.map((item, index) => (
              <li key={index} onClick={() => handleSongClick(item.track)}>
                {item.track.name} by{" "}
                {item.track.artists.map((artist) => artist.name).join(", ")}
              </li>
            ))}
          </ul>
        </ModalBody>

        <ModalFooter>
          <DeletePlaylistBtn accessToken={accessToken} playlistId={id} />
          <Button
            auto
            flat
            color="warning"
            variant="bordered"
            onClick={toggleEditModal}
          >
            Edit
          </Button>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
        {/* Edit Playlist Modal */}
        {isEditModalOpen && (
          <EditPlaylistModal
            playlistId={id}
            accessToken={accessToken}
            onPlaylistUpdated={onPlaylistUpdated}
            initialDetails={{ name, description }}
            onClose={onClose}
          />
        )}
      </ModalContent>
      <SongModal
        isOpen={isSongModalOpen}
        onClose={closeSongModal}
        song={selectedSong}
      />
    </Modal>
  );
}
