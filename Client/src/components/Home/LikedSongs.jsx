import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SpotifyAuth from "../Spotify/SpotifyAuth";
import SavedPlaylist from "../Playlist/SavedPlaylist";
import SongModal from "./SongDetail";
import { useSpotify } from "../Spotify/SpotifyContext";
import SongPages from "./SongPages";
import NavBar from "./NavBar";

const LikedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  // const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedSong, setSelectedSong] = useState(null);
  const { selectedSong, setSelectedSong, playlists, setPlaylists } =
    useSpotify();
  const handleSavedTracksChange = (tracks) => {
    setSavedTracks(tracks);
  };

  const onSongClick = (song) => {
    setSelectedSong(song); // Set the selected song
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div>
      <NavBar />
      <SpotifyAuth onSavedTracksChange={handleSavedTracksChange} />
      <div>
        <Table color="default" aria-label="Saved Songs Table">
          <TableHeader>
            <TableColumn>Song Title</TableColumn>
            <TableColumn>Artist</TableColumn>
            <TableColumn>Album</TableColumn>
          </TableHeader>
          <TableBody>
            {savedTracks.map((track, index) => (
              <TableRow
                css={{ cursor: "pointer" }}
                key={track.id || index}
                onClick={() => onSongClick(track)}
              >
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
        <SongPages />
      </div>
    </div>
  );
};
export default LikedSongs;
