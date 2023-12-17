import { useEffect, useState } from "react";
import { useSpotify } from "./SpotifyContext";

const SpotifyAuth = ({
  onAccessTokenChange,
  onSavedTracksChange,
  onPlaylistsChange,
}) => {
  const {
    setSavedTracks,
    savedTracks,
    userPlaylists,
    setUserPlaylists,
    accessToken,
    setAccessToken,
    setUserId,
    refreshToken,
    setRefreshToken,
  } = useSpotify();

  const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
  const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
  const redirect_uri = "http://localhost:5555/home";

  const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-private",
    "user-read-email",
  ].join(" ");

  //! Getting the Auth Code
  useEffect(() => {
    const getAuthorizationCode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("code");
    };

    //! Fetch token with Auth Code.
    const fetchAccessToken = async () => {
      const authorizationCode = getAuthorizationCode();
      console.log(authorizationCode);
      if (!authorizationCode) {
        console.error("No authorization code found");
        return;
      }

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
          scopes: scopes,
        }).toString(),
      };

      try {
        const response = await fetch(
          "https://accounts.spotify.com/api/token",
          authOptions
        );
        const data = await response.json();

        if (response.ok) {
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          if (onAccessTokenChange) onAccessTokenChange(data.access_token);
        } else {
          console.error("Error exchanging authorization code:", data);
        }
      } catch (error) {
        console.error("Error exchanging authorization code:", error);
      }
      //! Refresh Access
      async function refreshAccessToken() {
        const refresh_token = refreshToken;

        const authString = btoa(`${client_id}:${client_secret}`);

        try {
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${authString}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
              }).toString(),
            }
          );

          const data = await response.json();

          if (response.ok) {
            setAccessToken(data.access_token);
            setRefreshToken(data.refresh_token);
          } else {
            throw new Error(`Error refreshing token: ${data.error}`);
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
          // Handle error - maybe trigger re-authentication
        }
      }
    };
    fetchAccessToken();
  }, []);
  console.log("Refresh Token: ", refreshToken);

  //! User Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Response:", response);
          console.log("User Profile:", data);
          setUserId(data.id);
          // Here, you can set this data to your state or context
        } else {
          console.error("Error fetching user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  //! Refresh Access Token

  async function refreshAccessToken() {
    const refresh_token = await refreshToken;
    const authString = btoa(`${client_id}:${client_secret}`);
    const url = "https://accounts.spotify.com/api/token";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const { access_token, expires_in, new_refresh_token } = data;

      setAccessToken(access_token);

      // Optionally, update the refresh token if a new one is provided
      // storeRefreshToken(new_refresh_token); // Securely store the new refresh token

      return access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }
  //! Storing Refresh Token in the backend
  useEffect(() => {
    if (!refreshToken) return;

    const storeRefreshTokenInBackend = async () => {
      try {
        const response = await fetch(
          "http://localhost:5556/store_refresh_token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error storing refresh token:", error);
      }
    };

    storeRefreshTokenInBackend();
  }, [refreshToken]);

  //! User Saved Tracks
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
          setSavedTracks(data.items.map((item) => item.track));
          if (onSavedTracksChange)
            onSavedTracksChange(data.items.map((item) => item.track));
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

    fetchUserSavedTracks();
  }, [accessToken]); //
  //! User Playlist
  useEffect(() => {
    if (!accessToken) return;

    const fetchUserPlaylists = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/playlists`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserPlaylists(data.items);
          if (onPlaylistsChange) onPlaylistsChange(data.items);
        } else {
          console.error("Error fetching user playlists:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user playlists:", error);
      }
    };

    fetchUserPlaylists();
  }, [accessToken]);

  const addSongToPlaylist = async (playlistId, trackUri) => {
    if (!accessToken || !playlistId || !trackUri) {
      console.error("Missing required information");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [trackUri],
          }),
        }
      );

      if (response.ok) {
        console.log("Track added to the playlist successfully");
      } else {
        console.error(
          "Error adding track to the playlist:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error adding track to the playlist:", error);
    }
  };
  //   addSongToPlaylist("playlistId", "spotify:track:trackId");

  return (
    <div>
      <h1>Sierra</h1>
    </div>
  );
};

export default SpotifyAuth;
