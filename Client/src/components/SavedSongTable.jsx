import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SongDetail from "./SongDetail";

export default function SavedSongTable() {
  const [savedTracks, setSavedTracks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5556/user_saved_tracks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.tracks);
        setSavedTracks(data.tracks || []); // Ensure a default value even if data.tracks is undefined
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!Array.isArray(savedTracks)) {
    console.log("savedTracks is not an array:", savedTracks);
    return null;
  }

  return (
    <>
      <Table
        color="default"
        selectionMode=" "
        defaultSelectedKeys={[]}
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Song Title</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody>
          {savedTracks.map((track) => (
            <TableRow key={track.id} onClick={() => SongDetail(track)}>
              <TableCell>{track.track_title}</TableCell>
              <TableCell>{track.artist_name}</TableCell>
              <TableCell>{track.album_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
