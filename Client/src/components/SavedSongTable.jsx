import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SongDetail from "./SongDetail";

const SPOTIFY_CLIENT_ID = "6abb9eac788d42e08c2a50e3f5ff4e53";
const REDIRECT_URI = "http://localhost:5555/home"; // Update with your redirect URI

export default function SavedSongTable() {
  const [savedTracks, setSavedTracks] = useState([]);

  useEffect(() => {
    // Function to handle Spotify authorization
    const authorizeSpotify = async () => {
      // Step 1: Redirect the user to Spotify for authorization
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=user-library-read&response_type=code&state=some-state`;
    };

    // Step 2: Check if the authorization code is present in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      // Step 3: Exchange the authorization code for an access token on your server
      fetch(`token-exchange${authorizationCode}`)
        .then((response) => response.json())
        .then((data) => {
          // Step 4: Use the access token to fetch user's saved tracks
          fetch("http://127.0.0.1:5556/user_saved_tracks", {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setSavedTracks(data.tracks || []);
            })
            .catch((error) =>
              console.error("Error fetching user's saved tracks:", error)
            );
        })
        .catch((error) =>
          console.error("Error exchanging authorization code:", error)
        );
    } else {
      // Step 1: Redirect the user to Spotify for authorization (if not already authorized)
      authorizeSpotify();
    }
  }, []);

  console.log(savedTracks);

  if (!Array.isArray(savedTracks)) {
    console.log("savedTracks is not an array:", savedTracks);
    return null;
  }

  return (
    <>
      <Table
        color="default"
        selectionMode=" "
        defaultSelectedKeys={[]}
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Song Title</TableColumn>
          <TableColumn>Artist</TableColumn>
          <TableColumn>Album</TableColumn>
        </TableHeader>
        <TableBody>
          {savedTracks.map((track, index) => (
            <TableRow key={index} onClick={() => SongDetail(track)}>
              <TableCell>{track.track_title}</TableCell>
              <TableCell>{track.artist_name}</TableCell>
              <TableCell>{track.album_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
