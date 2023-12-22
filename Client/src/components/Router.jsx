import { Route, Routes } from "react-router-dom";
// import Account from "./Home/Account";
import CreatePlaylist from "./Playlist/CreatePlaylist";
import HomePage from "./Home/HomePage";
// import LoginBlob from "./Home/-Legacy-LoginBlob";
import Logout from "./Home/Logout";
import SavedPlaylist from "./Playlist/SavedPlaylist";
import SavedSongTable from "./Home/SavedSongTable";

import NotFound from "./Home/NotFound";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import NavBar from "./Home/NavBar";
import SongDetail from "./Home/SongDetail";
import Blob from "./Home/NewLoginBlob";
import { BrowserRouter as Router } from "react-router-dom";
// import App from "./App";
// import "./index.css";

function App() {
  const is_logged_in = true;

  return (
    <Router>
      <Routes>
        {is_logged_in ? (
          <>
            <Route path="/home" element={<HomePage />} />
            {/* <Route path="/account" element={<Account />} /> */}
            <Route path="/saved_songs" element={<SavedSongTable />} />
            <Route path="/song_details" element={<SongDetail />} />
            <Route
              path="/currently_playing"
              element={<CurrentlyPlayingCard />}
            />
            <Route path="/user_playlist" element={<SavedPlaylist />} />
            <Route path="/create_playlist" element={<CreatePlaylist />} />

            <Route path="/navbar" element={<NavBar />} />
            {/* <Route path="/" element={<LoginBlob />} /> */}
            <Route path="/" element={<Blob />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            {/* <Route path="/login" element={<LoginBlob />} /> */}
            <Route path="*" element={<HomePage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
