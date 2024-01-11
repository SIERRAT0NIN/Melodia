import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "../MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import Footer from "./Footer";
import SpotifyAuth from "../Spotify/SpotifyAuth";
import { useSpotify } from "../Spotify/SpotifyContext";
import { useLocation } from "react-router-dom";

function HomePage() {
  // const { accessToken, setAccessToken } = useSpotify(null);
  const { accessToken, setAccessToken } = useState(null);
  const location = useLocation();

  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search);
    const query = new URLSearchParams(location.search);

    // const code = urlParams.get("code");
    const code = query.get("code");

    if (code) {
      // Send the authorization code to your backend
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
            setAccessToken(data.access_token); // Save the access token using the method provided by your context or state management
            console.log("Access Token:", data.access_token);
          }
        })
        .catch((error) => {
          console.error("Error exchanging authorization code:", error);
        });
    }
  }, [location]);
  console.log(accessToken);
  return (
    <>
      <SpotifyAuth />
      <Container>
        <div className="nav-container">
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
    </>
  );
}

export default HomePage;
