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
import { useSpotify } from "../Spotify/SpotifyContext";
export default function SavedPlaylist() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { playlists, setPlaylists } = useSpotify(null);
  const openModalWithPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    onOpen();
  };

  if (!playlists || playlists.length === 0) {
    return <p>No playlists available.</p>;
  }

  return (
    <>
      <Table aria-label="User Playlists" css={{ cursor: "pointer" }}>
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
