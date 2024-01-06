import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardFooter,
  Button,
  Image,
} from "@nextui-org/react";
import SpotifyAuth from "../Spotify/SpotifyAuth";
import SavedPlaylist from "../Playlist/SavedPlaylist";
import SongModal from "./SongDetail";
import { useSpotify } from "../Spotify/SpotifyContext";
import SongPages from "./SongPages";
import NavBar from "./NavBar";
import Album from "./Album";

const LikedSongs = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [hasNoSongs, setHasNoSongs] = useState(false);
  const [showAlbumTracksModal, setShowAlbumTracksModal] = useState(true);
  const [currentAlbumTracks, setCurrentAlbumTracks] = useState([]);

  const { selectedSong, setSelectedSong, playlists, setPlaylists } =
    useSpotify();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const limit = 20;

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
          const tracks = data.items.map((item) => item.track);
          setSavedTracks(tracks);
          setHasNoSongs(tracks.length === 0);
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

  const onSongClick = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchAlbumTracks = async (albumId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowAlbumTracksModal(true);
        setCurrentAlbumTracks(data.items);
      } else {
        console.error("Error fetching album tracks:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching album tracks:", error);
    }
  };
  console.log(currentAlbumTracks);

  return (
    <div>
      <NavBar />
      <SpotifyAuth onSavedTracksChange={handleSavedTracksChange} />
      <div>
        {hasNoSongs ? (
          <div>No liked songs found. Start adding some!</div>
        ) : (
          <Table
            isCompact
            color="primary"
            aria-label="Saved Songs Table"
            shadow="none"
          >
            <TableHeader>
              <TableColumn color="primary">Song Title</TableColumn>
              <TableColumn>Artist</TableColumn>
              <TableColumn>Album</TableColumn>
            </TableHeader>
            <TableBody color="primary">
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
                    {track.album &&
                      track.album.images &&
                      track.album.images.length > 0 && (
                        <Card
                          isFooterBlurred
                          radius="lg"
                          className="border-none"
                          shadow="none"
                        >
                          <Image
                            alt="Woman listing to music"
                            className="object-cover"
                            height={200}
                            src={track.album.images[0].url}
                            width={200}
                          />
                          <CardFooter className="justify-between before:bg-white/10  border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                            <p className="text-tiny text-white/80">
                              {(track.album && track.album.name) || "N/A"}
                            </p>
                            <Button
                              className="text-tiny text-black bg-black/20"
                              variant="flat"
                              color="default"
                              radius="lg"
                              size="sm"
                              onClick={() => fetchAlbumTracks(track.album.id)}
                            >
                              See more!
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <SongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          songData={selectedSong}
        />
        <div className="flex justify-center">
          <SongPages
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      <Album
        isOpen={showAlbumTracksModal}
        onClose={() => setShowAlbumTracksModal(false)}
        tracks={currentAlbumTracks}
      />
    </div>
  );
};

export default LikedSongs;
