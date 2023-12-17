import React from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import CreatePlaylist from "./CreatePlaylist";
import SavedPlaylist from "./SavedPlaylist";

function HomePage() {
  return (
    <Container>
      <div className="nav-container">
        <NavBar />
      </div>
      <br />
      <div className="flex">
        <CreatePlaylist />
      </div>
      <div className="saved-song-table-container">
        <br />
        <br />
        <SavedSongTable />
        <SavedPlaylist />
      </div>
      <br />
    </Container>
  );
}

export default HomePage;
