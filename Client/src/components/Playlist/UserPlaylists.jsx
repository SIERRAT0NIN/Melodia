import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import PlaylistDetails from "./PlaylistDetails"; // Ensure this is the correct path

export default function UserPlaylists({ playlists, setPlaylists }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const openModalWithPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    onOpen();
  };

  // Check if playlists is an array and has items
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <p>No playlists available.</p>;
  }

  return (
    <>
      <Table aria-label="User Playlists">
        <TableHeader>
          <TableColumn>Playlist Name</TableColumn>
        </TableHeader>
        <TableBody>
          <Select
            items={animals}
            label="Favorite Animal"
            placeholder="Select an animal"
            className="max-w-xs"
          >
            {(animal) => (
              <SelectItem key={animal.value}>{animal.label}</SelectItem>
            )}
          </Select>
          {playlists.map((playlist) => (
            <TableRow
              key={playlist.id}
              onClick={() => openModalWithPlaylist(playlist)}
              css={{ cursor: "pointer" }}
            >
              <TableCell>{playlist.name || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PlaylistDetails
        playlist={selectedPlaylist}
        isOpen={isOpen}
        onClose={onOpenChange}
        setPlaylists={setPlaylists}
      />
    </>
  );
}
