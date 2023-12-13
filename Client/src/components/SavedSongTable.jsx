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

const CLIENT_SECRET = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
const SPOTIFY_CLIENT_ID = "6abb9eac788d42e08c2a50e3f5ff4e53";
const REDIRECT_URI = "http://localhost:5555/home"; // Update with your redirect URI

export default function SavedSongTable() {
  const [savedTracks, setSavedTracks] = useState([]);

  useEffect(() => {
    const authorizeSpotify = async () => {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=user-library-read&response_type=code&state=some-state`;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      fetch("http://127.0.0.1:5556/token-exchange/" + authorizationCode, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "grant_type=authorization_code&client_id=" +
          SPOTIFY_CLIENT_ID +
          "&client_secret=" +
          CLIENT_SECRET +
          "&redirect_uri=" +
          REDIRECT_URI +
          "&code=" +
          authorizationCode,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSavedTracks(data.tracks || []);
        })
        .catch((error) => {
          console.error("Error fetching user's saved tracks:", error);
        });
    } else {
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
