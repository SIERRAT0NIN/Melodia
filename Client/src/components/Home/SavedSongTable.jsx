import { useState, useEffect } from "react";
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
const SavedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const { selectedSong, setSelectedSong, playlists, setPlaylists } =
    useSpotify();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const limit = 30;

    if (!accessToken) return;

    const fetchUserSavedTracks = async () => {
      const offset = (currentPage - 1) * limit;

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSavedTracks(data.items.map((item) => item.track));
          setTotalPages(Math.ceil(data.total / limit));
        } else {
          console.error(
            "Error fetching user saved tracks:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user saved tracks:", error);
      }
    };

    fetchUserSavedTracks();
  }, [currentPage]);

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
  const onPageChange = (newPage) => {
    setCurrentPage(newPage); // Update the current page
  };

  //!Added class name flex gap-4 items-center
  return (
    <div
      className="auto relative items-center  responsive-table-wrapper"
      color="primary"
    >
      <SpotifyAuth
        onSavedTracksChange={handleSavedTracksChange}
        onPlaylistsChange={handlePlaylistsChange}
      />
      <div className="auto relative items-center">
        <Table color="success" aria-label="Saved Songs Table">
          <TableHeader wrapper className="table-header relative">
            <TableColumn>Song Title</TableColumn>
            <TableColumn className="artist-column">Artist</TableColumn>
            <TableColumn className="album-column">Album</TableColumn>
          </TableHeader>
          <TableBody className="responsive-table-wrapper flex">
            {savedTracks.map((track, index) => (
              <TableRow
                css={{ cursor: "pointer" }}
                key={track.id || index}
                onClick={() => onSongClick(track)}
                className="table-row"
              >
                <TableCell className="table-cell ">
                  {track.name || "N/A"}
                </TableCell>
                <TableCell className="table-cell">
                  {(track.artists && track.artists[0].name) || "N/A"}
                </TableCell>
                <TableCell className="table-cell">
                  {(track.album && track.album.name) || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center">
          <SongPages
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
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
