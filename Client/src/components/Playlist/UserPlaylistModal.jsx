import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useSpotify } from "../Spotify/SpotifyContext";

const UserPlaylistModal = ({ isOpen, onOpenChange, playlists = [] }) => {
  const { userId } = useSpotify();

  const userPlaylists = playlists.filter(
    (playlist) => playlist.owner.id === userId
  );

  // Simplified check for empty playlists
  if (userPlaylists.length === 0) {
    return <p>No playlists found for the current user.</p>;
  }

  const handleClose = () => {
    if (typeof onOpenChange === "function") {
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          User Playlists
        </ModalHeader>
        <ModalBody>
          <Table>
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Total Tracks</TableColumn>
            </TableHeader>
            <TableBody>
              {userPlaylists.map((playlist) => (
                <TableRow key={playlist.id}>
                  <TableCell>{playlist.name}</TableCell>
                  <TableCell>{playlist.tracks.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserPlaylistModal;
