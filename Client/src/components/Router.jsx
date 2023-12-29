import { Route, Routes } from "react-router-dom";
import Account from "./Home/Account";
import CreatePlaylist from "./Playlist/CreatePlaylist";
import HomePage from "./Home/HomePage";

import Logout from "./Home/Logout";
import SavedPlaylist from "./Playlist/SavedPlaylist";
import SavedSongTable from "./Home/SavedSongTable";
// import SongBasket from "./SongBasket/SongBasket";
import NotFound from "./Home/NotFound";
import CurrentlyPlayingCard from "./MusicPlayer/CurrentlyPlayingCard";

import Blob from "./Home/NewLoginBlob";
import { BrowserRouter as Router } from "react-router-dom";
import SearchResults from "./Search/SearchResults";
import BasketCollection from "./SongBasket/BasketCollection";

function App() {
  const is_logged_in = true;

  return (
    <Router>
      <Routes>
        {is_logged_in ? (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/saved_songs" element={<SavedSongTable />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/currently_playing"
              element={<CurrentlyPlayingCard />}
            />
            <Route path="/user_playlist" element={<SavedPlaylist />} />
            <Route path="/create_playlist" element={<CreatePlaylist />} />
            <Route path="/search_results" element={<SearchResults />} />
            <Route path="/create_playlist" element={<CreatePlaylist />} />
            <Route path="/baskets" element={<BasketCollection />} />
            <Route path="/" element={<Blob />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
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
