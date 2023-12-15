// SavedSongs.jsx

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SongDetail from "./SongDetail";
import SavedPlaylist from "./SavedPlaylist";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import SpotifyAuth from "./SpotifyAuth";

const SavedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    console.log("Access Token:", accessToken);
    // Fetch and set user's playlists if needed
    // fetchUserPlaylists();
  }, [accessToken]);

  const fetchUserPlaylists = () => {
    // Implement logic to fetch user's playlists and set the state
    // Update the setPlaylists state accordingly
  };

  return (
    <div>
      <SpotifyAuth onAccessTokenChange={(token) => setAccessToken(token)} />
      <CurrentlyPlayingCard accessToken={accessToken} />
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
            <TableRow key={track.track.id} onClick={() => SongDetail(track)}>
              <TableCell>{track.track.name || "N/A"}</TableCell>
              <TableCell>
                {(track.track.artists &&
                  track.track.artists[0] &&
                  track.track.artists[0].name) ||
                  "N/A"}
              </TableCell>
              <TableCell>
                {(track.track.album && track.track.album.name) || "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <SavedPlaylist playlists={playlists} />
    </div>
  );
};

export default SavedSongs;
