import React, { useState, useEffect } from "react";

const SpotifyTopArtists = ({ userId, accessToken }) => {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    if (!accessToken || !userId) {
      console.log("Access token or user ID missing");
      return;
    }

    const fetchTopArtists = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists`, // Modified endpoint for top artists
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTopArtists(data.items); // Setting top artists
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchTopArtists();
  }, [accessToken, userId]);

  return (
    <div className="glassmorphism-artist">
      <div className="container mt-3">
        <h1>Top Artists</h1>
        <table className="table">
          <thead>
            <tr>
              <th className="artist-table" scope="col">
                Artists
              </th>
            </tr>
          </thead>
          <tbody>
            {topArtists.map((artist) => (
              <tr key={artist.id}>
                <td>{artist.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpotifyTopArtists;
