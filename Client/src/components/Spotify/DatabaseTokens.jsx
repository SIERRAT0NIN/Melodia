import React, { useState, useEffect } from "react";
import { useSpotify } from "./SpotifyContext";
function TokenRetrievalComponent({ userId }) {
  const {} = useSpotify(null);
  //   const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:5556/get_token?user_id=${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setToken(data.access_token); // Assuming the response has an access_token field
      } catch (e) {
        setError(e.message);
        console.error("Error fetching token:", e);
      }
    };

    if (userId) {
      fetchToken();
    }
  }, [userId]);

  if (error) {
    return <div>Error fetching token: {error}</div>;
  }

  if (!token) {
    return <div>Loading token...</div>;
  }

  return (
    <div>
      <h2>Token Information</h2>
      <p>Access Token: {token}</p>
    </div>
  );
}

export default TokenRetrievalComponent;
