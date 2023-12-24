import React from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "../MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import CreatePlaylist from "../Playlist/CreatePlaylist";
import SavedPlaylist from "../Playlist/SavedPlaylist";
import SongBasket from "../SongBasket/SongBasket";
import { useSpotify } from "../Spotify/SpotifyContext";
import Footer from "./Footer";

function HomePage() {
  const { accessToken } = useSpotify();
  return (
    <Container>
      <div className="nav-container">
        <NavBar />
      </div>

      <div className="saved-song-table-container">
        <br />
        <CurrentlyPlayingCard accessToken={accessToken} />
        <br />
        <SavedSongTable />
        <br />
        {/* <CreatePlaylist /> */}
        {/* <SavedPlaylist /> */}
      </div>
      <Footer />
    </Container>
  );
}

export default HomePage;
