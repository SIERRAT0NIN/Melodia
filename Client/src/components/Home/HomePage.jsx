import React from "react";
import NavBar from "./NavBar";
import CurrentlyPlayingCard from "../MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Container from "react-bootstrap/Container";
import Footer from "./Footer";

function HomePage() {
  return (
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
  );
}

export default HomePage;
