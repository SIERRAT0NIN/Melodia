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
import PlaylistPages from "./PlaylistPages";
const SavedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [savedPlaylist, setSavedPlaylist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [currentPlaylistPage, setCurrentPlaylistPage] = useState(1);
  const [totalPlaylistPages, setTotalPlaylistPages] = useState(0);

  const { selectedSong, setSelectedSong, playlists, setPlaylists } =
    useSpotify();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const limit = 25;

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
  }, [accessToken, currentPage]);

  useEffect(() => {
    const limit = 25;

    if (!accessToken) return;

    const fetchUserSavedPlaylist = async () => {
      const offset = (currentPlaylistPage - 1) * limit;

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, // Corrected the URL
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.items);
          setSavedPlaylist(data.items); // Corrected the map to data.items
          setTotalPlaylistPages(Math.ceil(data.total / limit)); // Set total pages for playlists

          // Removed setTotalPages as we might have a different total page count for playlists
        } else {
          console.error(
            "Error fetching user saved playlists:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user saved playlists:", error);
      }
    };

    fetchUserSavedPlaylist(); // Call the correct function here
  }, [accessToken, currentPlaylistPage]);

  const handleSavedTracksChange = (tracks) => {
    setSavedTracks(tracks);
  };
  const onPlaylistPageChange = (newPage) => {
    setCurrentPlaylistPage(newPage);
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
      className="auto relative items-center  responsive-table-wrapper mr-3"
      color="primary"
    >
      <SpotifyAuth
        onSavedTracksChange={handleSavedTracksChange}
        onPlaylistsChange={handlePlaylistsChange}
      />
      <div className="auto relative items-center">
        <Table color="success" aria-label="Saved Songs Table">
          <TableHeader
            wrapper
            className="table-header relative justify-between text-lg"
          >
            <TableColumn className="text-lg bg-gradient-to-r from-blue-500  to-green-500 text-white p-5  rounded-tl-md text-center shadow-md 		">
              Song Title
            </TableColumn>
            <TableColumn className="text-lg bg-gradient-to-r  from-green-500 to-purple-500  text-white   p-5  text-center shadow-md   		">
              Artist
            </TableColumn>
            <TableColumn className="text-lg bg-gradient-to-r from-purple-500 to-yellow-500 text-white p-5   rounded-tr-md text-center shadow-md    		">
              Album
            </TableColumn>
          </TableHeader>
          <TableBody className="responsive-table-wrapper flex">
            {savedTracks.map((track, index) => (
              <TableRow
                css={{ cursor: "pointer" }}
                key={track.id || index}
                onClick={() => onSongClick(track)}
                className="table-row"
              >
                <TableCell className=" sm:table-cell ">
                  {track.name || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {(track.artists && track.artists[0].name) || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
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
      {/* SavedPlaylist should include both the display of the playlists and the pagination for playlists */}
      {/* <SavedPlaylist
        playlists={savedPlaylist}
        setPlaylists={setSavedPlaylist}
      /> */}
      {/* Pagination for saved playlists, only if playlists are being displayed */}
      {/* {savedPlaylist.length > 0 && (
        <div className="flex justify-center"> */}
      {/* <SongPages
            currentPage={currentPlaylistPage}
            totalPages={totalPlaylistPages}
            onPageChange={onPlaylistPageChange}
          /> */}
      {/* <PlaylistPages
            currentPage={currentPlaylistPage}
            totalPages={totalPlaylistPages}
            onPageChange={onPlaylistPageChange}
          /> */}
      {/* </div>
      )} */}
      {/* Conditional rendering for the song detail modal */}
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
