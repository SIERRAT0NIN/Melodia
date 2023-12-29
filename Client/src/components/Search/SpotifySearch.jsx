import { useState, useEffect } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import { Input, Button } from "@nextui-org/react";
import SearchResults from "../Search/SearchResults";

const SpotifySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    tracks: { items: [] },
    artists: { items: [] },
    albums: { items: [] },
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    accessToken,
    setSelectedSong,
    setAccessToken,
    setSelectedArtist,
    selectedArtist,
  } = useSpotify("");

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, [setAccessToken]);

  const fetchSpotifyData = async (query, token) => {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track,artist,album`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error for handling it in the calling function
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const data = await fetchSpotifyData(searchQuery, accessToken);
      setSearchResults(data);
    } catch (error) {
      // Handle error (maybe set an error state and display a message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongClick = (song) => {
    console.log("Selected Song:", song);
    setSelectedSong(song);
  };

  const handleArtistClick = (artist) => {
    console.log("Selected Artist:", artist);
    setSelectedArtist(artist);
  };

  const handleAlbumClick = (album) => {
    console.log("Selected Album:", album);
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for artists, songs, albums..."
        />
        <Button type="submit">Search</Button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <SearchResults
          accessToken={accessToken}
          searchData={searchResults}
          onSongClick={handleSongClick}
          onArtistClick={handleArtistClick}
          onAlbumClick={handleAlbumClick}
        />
      )}
    </div>
  );
};

export default SpotifySearch;
