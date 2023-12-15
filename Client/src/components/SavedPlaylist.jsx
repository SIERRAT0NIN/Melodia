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

  return (
    <Table aria-label="User Playlists">
      <TableHeader>
        <TableColumn>Playlist Name</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Total Tracks</TableColumn>
        <TableColumn>Public</TableColumn>
        <TableColumn>Image</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No playlists to display.">
        {playlists.map((playlist) => (
          <TableRow key={playlist.id}>
            <TableCell>{playlist.name || "N/A"}</TableCell>
            <TableCell>{playlist.description || "N/A"}</TableCell>
            <TableCell>{playlist.tracks.total || "N/A"}</TableCell>
            <TableCell>{playlist.public ? "Yes" : "No"}</TableCell>
            <TableCell>
              {playlist.images && playlist.images.length > 0 ? (
                <img
                  src={playlist.images[0].url || "No Image"}
                  alt="Playlist Image"
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
