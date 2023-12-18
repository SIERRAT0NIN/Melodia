import React, { useState } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";

const SpotifySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useSpotify("");
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track,artist,album`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for artists, songs, albums..."
        />
        <button type="submit">Search</button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Render search results here */}
          {/* Example: */}
          {searchResults.tracks?.items.map((track) => (
            <div key={track.id}>
              <p>
                {track.name} -{" "}
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          ))}
          {/* Similar rendering for artists and albums */}
        </div>
      )}
    </div>
  );
};

export default SpotifySearch;
