import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SpotifyAuth from "./SpotifyAuth";
import SavedPlaylist from "./SavedPlaylist";
// Include any other necessary imports

const SavedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const handleSavedTracksChange = (tracks) => {
    setSavedTracks(tracks);
  };

  const handlePlaylistsChange = (playlists) => {
    setPlaylists(playlists);
  };
  console.log(playlists);
  console.log("Saved Tracks:", savedTracks);
  return (
    <div>
      <SpotifyAuth
        onSavedTracksChange={handleSavedTracksChange}
        onPlaylistsChange={handlePlaylistsChange}
      />
      <Table color="default" aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Song Title</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody>
          {savedTracks.map((track, index) => (
            <TableRow key={track.id || index}>
              <TableCell>{track.name || "N/A"}</TableCell>
              <TableCell>
                {(track.artists && track.artists[0].name) || "N/A"}
              </TableCell>
              <TableCell>
                {(track.album && track.album.name) || "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SavedPlaylist playlists={playlists} />
    </div>
  );
};

export default SavedSongs;
