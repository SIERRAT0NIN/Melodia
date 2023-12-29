import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableColumn,
  TableBody,
} from "@nextui-org/react";
import SongModal from "./SearchDetailsModal";
import { useState } from "react";
function SearchResults({
  searchData,
  onSongClick,
  onArtistClick,
  onAlbumClick,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);

    // Move this logic inside the handleItemClick function
    if (item.type === "track") {
      onSongClick(item);
    } else if (item.type === "artist") {
      onArtistClick(item);
    } else if (item.type === "album") {
      onAlbumClick(item);
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
          >
            <TableCell>{track.name}</TableCell>
            <TableCell>
              {track.artists.map((artist) => artist.name).join(", ")}
            </TableCell>
            <TableCell>{track.album.name}</TableCell>
          </TableRow>
        );
      });
    }

    // Adding artists
    if (searchData.artists && searchData.artists.items.length > 0) {
      searchData.artists.items.forEach((artist) => {
        rows.push(
          <TableRow
            key={artist.id}
            clickable
            onClick={() => handleItemClick(artist)}
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

    return rows;
  };

  return (
    <div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Songs</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      <SongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        songData={selectedItem}
      />
    </div>
  );
}

export default SearchResults;
