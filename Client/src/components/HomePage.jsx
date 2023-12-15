import React from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import CreatePlaylist from "./CreatePlaylist";

function HomePage() {
  return (
    <Container>
      <div className="nav-container">
        <NavBar />
      </div>
      <br />

      <div className="saved-song-table-container">
        <br />
        <br />
        <CreatePlaylist />
        <SavedSongTable />
      </div>
      <br />
    </Container>
  );
}

export default HomePage;
