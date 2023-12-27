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
const SavedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedSong, setSelectedSong] = useState(null);
  const { selectedSong, setSelectedSong } = useSpotify();
  const handleSavedTracksChange = (tracks) => {
    setSavedTracks(tracks);
  };

  const handlePlaylistsChange = (playlists) => {
    setPlaylists(playlists);
  };

  const onSongClick = (song) => {
    setSelectedSong(song); // Set the selected song
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div>
      <SpotifyAuth
        onSavedTracksChange={handleSavedTracksChange}
        onPlaylistsChange={handlePlaylistsChange}
      />
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
      </div>
      <br />
      <SavedPlaylist playlists={playlists} setPlaylists={setPlaylists} />
      {selectedSong && (
        <SongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          songData={selectedSong}
        />
      )}
    </div>
  );
};

export default SavedSongs;
