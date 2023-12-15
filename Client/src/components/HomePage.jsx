import React from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";

function HomePage() {
  return (
    <Container>
      <div className="nav-container">
        <NavBar />
      </div>
      <br />
      <div className="saved-song-table-container">
        <br />
        <SavedSongTable />
      </div>
      <br />
    </Container>
  );
}

export default HomePage;
