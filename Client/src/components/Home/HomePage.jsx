import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "../MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import Footer from "./Footer";
import SpotifyAuth from "../Spotify/SpotifyAuth";

import Playlist from "../Playlist/Playlists";
import Navbar2 from "./NavBar2";
import SpotifyTopArtists from "../Profile/TopArtist";
// import { useSpotify } from "../Spotify/SpotifyContext";
// import { useLocation } from "react-router-dom";

function HomePage() {
  // const { accessToken, setAccessToken } = useSpotify(null);
  const { accessToken, setAccessToken } = useState(null);
  // const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // const query = new URLSearchParams(location.search);

    const code = urlParams.get("code");
    // const code = query.get("code");

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
            localStorage.setItem("accessToken", data.access_token); //! ACCESS TOKEN

            console.log("Access Token:", data.access_token);
          }
        })
        .catch((error) => {
          console.error("Error exchanging authorization code:", error);
        });
    }
  }, [accessToken]);

  return (
    <>
      <Navbar2 />
      <div className="m-4">
        <CurrentlyPlayingCard />
      </div>
      <div className="flex flex-col md:flex-row justify-center p-5 space-y-4 md:space-y-0 md:space-x-4">
        <SavedSongTable />
        <Playlist />
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
