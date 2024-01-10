import React, { useEffect } from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "../MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import Footer from "./Footer";
import SpotifyAuth from "../Spotify/SpotifyAuth";
import { useSpotify } from "../Spotify/SpotifyContext";
function HomePage() {
  const { accessToken, setAccessToken } = useSpotify(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Send the authorization code to the backend
      fetch("http://127.0.0.1:5556/token-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            // Handle the access token as needed in your app
            setAccessToken(data.access_token);
            console.log("Access Token:", data.access_token);
          }
        })
        .catch((error) => {
          console.error("Error exchanging authorization code:", error);
        });
    }
  }, []);
  console.log(accessToken);
  return (
    <Container>
      <div className="nav-container">
        <SpotifyAuth />
        <NavBar />
      </div>
      <div className="saved-song-table-container">
        <br />
        <CurrentlyPlayingCard />
        <br />
        <SavedSongTable />
        <br />
      </div>
      <Footer />
    </Container>
  );
}

export default HomePage;
