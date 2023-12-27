import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableColumn,
  TableBody,
} from "@nextui-org/react";
import SongModal from "./SearchDetailsModal";
// import { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";

function SearchResults({
  searchData,
  onArtistClick,
  onSongClick,
  onAlbumClick,
}) {
  // const { accessToken, setSelectedSong, selectedSong } = useSpotify();
  // const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  console.log(searchData, "Search Data");
  const renderTableRows = () => {
    const rows = [];
    if (searchData.tracks && searchData.tracks.items.length > 0) {
      searchData.tracks.items.forEach((track) =>
        rows.push(
          <TableRow key={track.id} clickable onClick={() => onSongClick(track)}>
            <TableCell>{track.name}</TableCell>
            <TableCell>
              {track.artists.map((artist) => artist.name).join(", ")}
            </TableCell>
            <TableCell>{track.album.name}</TableCell>
          </TableRow>
        )
      );
    }

    if (searchData.artists && searchData.artists.items.length > 0) {
      searchData.artists.items.forEach((artist) =>
        rows.push(
          <TableRow
            key={artist.id}
            clickable
            onClick={() => onArtistClick(artist)}
          >
            <TableCell>{artist.name}</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>{artist.genres.join(", ")}</TableCell>
          </TableRow>
        )
      );
    }

    if (searchData.albums && searchData.albums.items.length > 0) {
      searchData.albums.items.forEach((album) =>
        rows.push(
          <TableRow
            key={album.id}
            clickable
            onClick={() => onAlbumClick(album)}
          >
            <TableCell>{album.name}</TableCell>
            <TableCell>Album</TableCell>
            <TableCell>
              {album.artists.map((artist) => artist.name).join(", ")}
            </TableCell>
          </TableRow>
        )
      );
    }

    return rows;
  };

  // const toggleSearchModal = () => {
  //   setIsSearchModalOpen(!isSearchModalOpen);
  // };
  // const handleSongClick = (selectedSong) => {
  //   setSelectedSong(selectedSong);
  // };

  return (
    <div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Songs</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody onClick={onSongClick}>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
}

export default SearchResults;
