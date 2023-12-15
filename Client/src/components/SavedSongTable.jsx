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
import SongModal from "./SongDetail"; // Assuming SongModal is the SongDetail component

const SavedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null); // State to store the selected song

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
  console.log(playlists);
  return (
    <div>
      <SpotifyAuth
        onSavedTracksChange={handleSavedTracksChange}
        onPlaylistsChange={handlePlaylistsChange}
      />
      <Table color="default" aria-label="Saved Songs Table">
        <TableHeader>
          <TableColumn>Song Title</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody>
          {savedTracks.map((track, index) => (
            <TableRow
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
      <SavedPlaylist playlists={playlists} />
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
