import NavBar from "./NavBar";
import SongDetail from "./SongDetail";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import SavedSongTable from "./SavedSongTable";
import Account from "./Account";

function HomePage() {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="flex">
        <CurrentlyPlayingCard />
      </div>
      <SongDetail />
      <SavedSongTable />
    </div>
  );
}

export default HomePage;
