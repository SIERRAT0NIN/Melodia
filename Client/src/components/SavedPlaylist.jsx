import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function SavedPlaylist({ playlists }) {
  console.log("Received playlists:", playlists);

  // Check if playlists data is available
  if (!playlists || playlists.length === 0) {
    return <p>No playlists available to display.</p>;
  }

  return (
    <Table aria-label="User Playlists">
      <TableHeader>
        <TableColumn>Playlist Name</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Total Tracks</TableColumn>
        <TableColumn>Public</TableColumn>
        <TableColumn>Image</TableColumn>
      </TableHeader>
      <TableBody>
        {playlists.map((playlist) => (
          <TableRow key={playlist.id}>
            <TableCell>{playlist.name || "N/A"}</TableCell>
            <TableCell>{playlist.description || "N/A"}</TableCell>
            <TableCell>
              {playlist.tracks ? playlist.tracks.total : "N/A"}
            </TableCell>
            <TableCell>{playlist.public ? "Yes" : "No"}</TableCell>
            <TableCell>
              {playlist.images && playlist.images[0] ? (
                <img
                  src={playlist.images[0].url || ""}
                  alt={`${playlist.name} Cover`}
                  style={{ width: "50px", height: "50px" }}
                />
              ) : (
                "No Image"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
