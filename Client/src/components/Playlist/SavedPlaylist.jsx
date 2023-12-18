import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
} from "@nextui-org/react";
import PlaylistDetails from "./PlaylistDetails";

export default function SavedPlaylist({ playlists, setPlaylists }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const openModalWithPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    onOpen();
  };

  if (!playlists || playlists.length === 0) {
    return <p>No playlists available.</p>;
  }

  return (
    <>
      <Table aria-label="User Playlists">
        <TableHeader>
          <TableColumn>Playlist Name</TableColumn>
        </TableHeader>
        <TableBody>
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
