import { useEffect, useState } from "react";
import SavedSongs from "./SavedSongTable";

const SpotifyAuth = () => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
  const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
  const redirect_uri = "http://localhost:5555/home";

  useEffect(() => {
    const getAuthorizationCode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("code");
    };

    const fetchAccessToken = async () => {
      try {
        const authorizationCode = getAuthorizationCode();

        if (authorizationCode) {
          const authOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(client_id + ":" + client_secret),
            },
            body: new URLSearchParams({
              code: authorizationCode,
              redirect_uri: redirect_uri,
              grant_type: "authorization_code",
            }).toString(),
          };

          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            authOptions
          );
          const data = await response.json();

          if (response.ok) {
            console.log("Access Token:", data.access_token);
            setAccessToken(data.access_token);
          } else {
            console.error("Error exchanging authorization code:", data);
          }
        } else {
          console.error("No authorization code found");
        }
      } catch (error) {
        console.error("Error exchanging authorization code:", error);
      }
    };

    // Call the function to fetch access token
    fetchAccessToken();
  }, []); // Empty dependency array, effect runs once on mount

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserSavedTracks = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/tracks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSavedTracks(data.items[0].track);
        } else {
          console.error(
            "Error fetching user saved tracks:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user saved tracks:", error);
      }
    };

    const fetchUserPlaylists = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserPlaylists(data.items);
        } else {
          console.error("Error fetching user playlists:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user playlists:", error);
      }
    };

    fetchUserSavedTracks();
    fetchUserPlaylists();
  }, [accessToken]);
  console.log(savedTracks);
  console.log(userPlaylists);

  return (
    <div>
      <h1>test</h1>
    </div>
  );
};

export default SpotifyAuth;
