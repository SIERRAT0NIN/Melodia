import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableColumn,
  TableBody,
  Button,
} from "@nextui-org/react";
import SongModal from "./SearchDetailsModal";
import { useState, useEffect } from "react";
import SearchArtistModal from "./SearchArtistModal";
import SeachAlbumModal from "./SearchAlbumModal";
import { useSpotify } from "../Spotify/SpotifyContext";
import SearchAlbumModal from "./SearchAlbumModal";
function SearchResults({
  searchData,
  onSongClick,
  onArtistClick,
  onAlbumClick,
  handleSongToBasket,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const { selectedBasketId } = useSpotify();
  const [selectedSongs, setSelectedSongs] = useState([]);

  const handleItemClick = (item) => {
    if (item.type === "track") {
      setSelectedItem(item);
      setIsModalOpen(true);
      onSongClick(item);
    } else if (item.type === "artist") {
      setSelectedArtist(item);
      setIsArtistModalOpen(true);
      onArtistClick(item);
    } else if (item.type === "album") {
      setSelectedAlbum(item);
      setIsAlbumModalOpen(true);
      onAlbumClick(item);
    }
  };

  const handleSelectionChange = (selectedRows) => {
    if (selectedRows instanceof Set) {
      const selectedSongIDs = Array.from(selectedRows);

      // Map IDs to song details
      const selectedSongDetails = selectedSongIDs
        .map((id) => {
          const song = searchData.tracks.items.find((track) => track.id === id);
          return song
            ? {
                id: song.id,
                name: song.name,
                album: song.album.name,
                artist: song.artists.map((artist) => artist.name).join(", "),
                image: song.album.images[0].url,
                uri: song.uri,
              }
            : null;
        })
        .filter((song) => song !== null); // Filter out any nulls

      console.log("Selected Song Details:", selectedSongDetails);
      setSelectedSongs(selectedSongDetails); // Update state with song details
    } else {
      console.error("selectedRows is not a recognized format:", selectedRows);
    }
  };
  const prepareSongDataForBackend = () => {
    return selectedSongs.map((song) => ({
      basket_id: selectedBasketId,
      track_id: song.id,
      track_name: song.name,
      track_image: song.image,
      track_album: song.album,
      track_artist: song.artist,
      track_uri: song.uri,
    }));
  };
  const sendSelectedSongToBackend = async () => {
    const songData = prepareSongDataForBackend();
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:5556/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the token in the request header
        },
        body: JSON.stringify(songData),
      });

      if (!response.ok) {
        throw new Error("Failed to send songs to backend");
      }

      const responseData = await response.json();
      console.log("Response from backend:", responseData);
      handleSongToBasket(selectedBasketId, responseData);
    } catch (error) {
      console.error("Error sending selected songs to backend:", error);
    }
  };

  const renderTableRows = () => {
    const rows = [];
    // Adding tracks
    if (searchData.tracks && searchData.tracks.items.length > 0) {
      searchData.tracks.items.forEach((track) => {
        rows.push(
          <TableRow
            key={track.id}
            clickable
            onClick={() => handleItemClick(track)}
            scrollBehavior={"inside"}
          >
            <TableCell>{track.name}</TableCell>
            <TableCell>
              {track.artists.map((artist) => artist.name).join(", ")}
            </TableCell>
            <TableCell>{track.album.name}</TableCell>
          </TableRow>
        );
      });
      return rows;
    }

    // Adding artists
    if (searchData.artists && searchData.artists.items.length > 0) {
      searchData.artists.items.forEach((artist) => {
        rows.push(
          <TableRow
            key={artist.id}
            clickable
            onClick={() => handleArtistItemClick(artist)}
          >
            <TableCell>{artist.name}</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>{artist.genres.join(", ")}</TableCell>
          </TableRow>
        );
      });
    }

    // Adding albums
    if (searchData.albums && searchData.albums.items.length > 0) {
      searchData.albums.items.forEach((album) => {
        rows.push(
          <TableRow
            key={album.id}
            clickable
            onClick={() => handleItemClick(album)}
          >
            <TableCell>{album.name}</TableCell>
            <TableCell>Album</TableCell>
            <TableCell>
              {album.artists.map((artist) => artist.name).join(", ")}
            </TableCell>
          </TableRow>
        );
      });
    }
  };
  const handleArtistItemClick = (artist) => {
    setSelectedArtist(artist);
    setIsArtistModalOpen(true);
    onArtistClick(artist);
  };
  const renderArtistTableRows = () => {
    return searchData.artists.items.map((artist) => (
      <TableRow
        key={artist.id}
        clickable
        onClick={() => handleArtistItemClick(artist)}
      >
        <TableCell>{artist.name}</TableCell>
        <TableCell>{artist.genres.join(", ")}</TableCell>
      </TableRow>
    ));
  };
  const renderAlbumTableRows = () => {
    return searchData.albums.items.map((album) => (
      <TableRow key={album.id} clickable onClick={() => handleItemClick(album)}>
        <TableCell>{album.name}</TableCell>
        <TableCell>
          {album.artists.map((artist) => artist.name).join(", ")}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
      <Table
        aria-label="Search results"
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader>
          <TableColumn>Songs</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      {searchData.artists && searchData.artists.items.length > 0 && (
        <Table aria-label="Artist results">
          <TableHeader>
            <TableColumn>Artist Name</TableColumn>
            <TableColumn>Genres</TableColumn>
          </TableHeader>
          <TableBody>{renderArtistTableRows()}</TableBody>
        </Table>
      )}
      {searchData.albums && searchData.albums.items.length > 0 && (
        <Table aria-label="Album results">
          <TableHeader>
            <TableColumn>Album Name</TableColumn>
            <TableColumn>Artists</TableColumn>
          </TableHeader>
          <TableBody>{renderAlbumTableRows()}</TableBody>
        </Table>
      )}
      {isArtistModalOpen && (
        <SearchArtistModal
          isOpen={isArtistModalOpen}
          onClose={() => setIsArtistModalOpen(false)}
          artistData={selectedArtist}
        />
      )}
      {isAlbumModalOpen && (
        <SearchAlbumModal
          isOpen={isAlbumModalOpen}
          onClose={() => setIsAlbumModalOpen(false)}
          albumData={selectedAlbum}
        />
      )}
      <SongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        songData={selectedItem}
        scrollBehavior={"inside"}
      />
      <Button onClick={() => sendSelectedSongToBackend()}>
        Save Song Basket!
      </Button>
    </div>
  );
}

export default SearchResults;
