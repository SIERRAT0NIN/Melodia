import { Route, Routes } from "react-router-dom";
import Account from "./Profile/Account";
import CreatePlaylist from "./Playlist/CreatePlaylist";
import HomePage from "./Home/HomePage";
import Logout from "./Home/Logout";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";
import Blob from "./Home/NewLoginBlob";
import { BrowserRouter as Router } from "react-router-dom";
import SearchResults from "./Search/SearchResults";
import BasketCollection from "./SongBasket/BasketCollection";
import Playlist from "./Playlist/Playlists";
import LikedSongs from "./Home/LikedSongs";

function App() {
  const is_logged_in = true;

  return (
    <Router>
      <Routes>
        {is_logged_in ? (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/saved_songs" element={<LikedSongs />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/currently_playing"
              element={<CurrentlyPlayingCard />}
            />
            <Route path="/user_playlist" element={<Playlist />} />
            <Route path="/create_playlist" element={<CreatePlaylist />} />
            <Route path="/search_results" element={<SearchResults />} />
            <Route path="/baskets" element={<BasketCollection />} />
            <Route path="/" element={<Blob />} />
            <Route path="/logout" element={<Logout />} />
          </>
        ) : (
          <>
            <Route path="*" element={<HomePage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
