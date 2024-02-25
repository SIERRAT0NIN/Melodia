import React, { useState, useEffect } from "react";

const SpotifyTopTracks = ({ userId, accessToken }) => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    if (!accessToken || !userId) {
      console.log("Access token or user ID missing");
      return;
    }

    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks`,
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
        setTopTracks(data.items);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchTopTracks();
  }, [accessToken, userId]);

  return (
    <div className="glassmorphism-tracks ">
      <div className="container mt-3  ">
        <h1>Top Tracks</h1>
        <table className="table">
          <thead>
            <tr>
              <th className="track-table " scope="col">
                Track
              </th>
              <th className="track-table2" scope="col">
                Artists
              </th>
            </tr>
          </thead>
          <tbody>
            {topTracks.map((track) => (
              <tr key={track.id}>
                <td>{track.name}</td>
                <td>{track.artists.map((artist) => artist.name).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpotifyTopTracks;
