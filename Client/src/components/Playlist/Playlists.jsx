import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  PaginationItem,
  Pagination,
  usePagination,
  Button,
} from "@nextui-org/react";
import PlaylistDetails from "./PlaylistDetails";
import { useSpotify } from "../Spotify/SpotifyContext";
import NavBar from "../Home/NavBar";
import Footer from "../Home/Footer";
import PlaylistPages from "../Home/PlaylistPages";
export default function Playlist() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { playlists, setPlaylists } = useSpotify(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchUserPlaylists = async () => {
      const offset = (currentPage - 1) * limit;
      const limit = 25;
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/playlists`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPlaylists(data.items);
          setTotalPages(Math.ceil(data.total / limit));
        } else {
          console.error("Error fetching user playlists:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user playlists:", error);
      }
    };

    fetchUserPlaylists();
  }, []);

  const openModalWithPlaylist = async (playlist) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!playlist.tracks) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          playlist.tracks = data.items; // Add tracks to playlist
        } else {
          console.error("Error fetching playlist songs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
      }
    }
    setSelectedPlaylist(playlist);
    onOpen();
  };

  if (!playlists || playlists.length === 0) {
    return <p>No playlists available.</p>;
  }
  const onPageChange = (newPage) => {
    setCurrentPage(newPage); // Update the current page
  };
  return (
    <>
      <div className="">
        <Table aria-label="User Playlists" css={{ cursor: "pointer" }}>
          <TableHeader>
            <TableColumn className="text-lg bg-gradient-to-r from-blue-500 to-yellow-500 text-white p-5 rounded text-center shadow-md">
              Playlist Name
            </TableColumn>
          </TableHeader>
          <TableBody>
            {playlists.map((playlist) => (
              <TableRow
                key={playlist.id}
                onClick={() => openModalWithPlaylist(playlist)}
                css={{ cursor: "pointer" }}
              >
                <TableCell>{playlist.name || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <PlaylistDetails
          playlist={selectedPlaylist}
          isOpen={isOpen}
          onClose={onOpenChange}
          setPlaylists={setPlaylists}
        />
        <PlaylistPages
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
