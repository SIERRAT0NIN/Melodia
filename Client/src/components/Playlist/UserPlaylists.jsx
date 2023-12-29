import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Spinner } from "@nextui-org/react";
import UserPlaylistModal from "./UserPlaylistModal";
import { useSpotify } from "../Spotify/SpotifyContext";

function UserPlaylist({ isOpen, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId, accessToken } = useSpotify();

  useEffect(() => {
    if (!userId || !accessToken) {
      console.error("User ID or Access Token is missing");
      setLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch playlists");

        const data = await response.json();
        setPlaylists(
          data.items.filter((playlist) => playlist.owner.id === userId)
        );
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId, accessToken]);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div>
      <Button onClick={openModal}>View Playlists</Button>
      <UserPlaylistModal
        isOpen={isModalOpen}
        onClose={closeModal}
        playlists={playlists}
      />
    </div>
  );
}

export default UserPlaylist;
