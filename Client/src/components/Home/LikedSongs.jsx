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
import NavBar from "./NavBar";

const LikedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Set this based on total available pages

  const { selectedSong, setSelectedSong, playlists, setPlaylists } =
    useSpotify();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const limit = 20; // Number of items per page

    if (!accessToken) return;

    const fetchUserSavedTracks = async () => {
      const offset = (currentPage - 1) * limit; // Calculate the offset based on the current page

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
          setTotalPages(Math.ceil(data.total / limit)); // Update total pages based on the total number of items
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

  const onSongClick = (song) => {
    setSelectedSong(song); // Set the selected song
    setIsModalOpen(true); // Open the modal
  };
  const onPageChange = (newPage) => {
    setCurrentPage(newPage); // Update the current page
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
        <SongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          songData={selectedSong}
          // onAddToPlaylist={handleAddToPlaylist} // Define this method as per your logic
        />
        <div className="flex justify-center">
          <SongPages
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
export default LikedSongs;
