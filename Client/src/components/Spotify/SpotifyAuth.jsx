import { useEffect, useState } from "react";
import { useSpotify } from "./SpotifyContext";

const SpotifyAuth = ({
  onAccessTokenChange,
  onSavedTracksChange,
  onPlaylistsChange,
}) => {
  const {
    setSavedTracks,
    setUserPlaylists,
    accessToken,
    setAccessToken,
    setUserId,
    refreshToken,
    setRefreshToken,
    setDisplayName,
    setUserEmail,
    setUserImg,
    displayName,
    userEmail,
    userImg,
    userId,
    accessTokenExpiresAt,
    setAccessTokenExpiresAt,
    refreshTokenExpiresAt,
    setRefreshTokenExpiresAt,
  } = useSpotify();
  const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
  const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
  const redirect_uri = "http://localhost:5555/home";

  // const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  // const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  // const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  const calculateAccessTokenExpiration = () => {
    const currentTime = new Date();
    const expiresIn = 3600;
    return new Date(currentTime.getTime() + expiresIn * 1000);
  };

  const calculateRefreshTokenExpiration = () => {
    const currentTime = new Date();
    const expiresIn = 604800;
    return new Date(currentTime.getTime() + expiresIn * 1000);
  };

  //! Getting the Auth Code
  //* Working
  useEffect(() => {
    const getAuthorizationCode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("code");
    };

    //! Fetch token with Auth Code.
    //* Working
    const fetchAccessToken = async () => {
      const authorizationCode = getAuthorizationCode();
      if (!authorizationCode) {
        console.error("No authorization code found");
        return;
      }

      const authOptions = {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri,
          client_id,
          client_secret,
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
          setAccessTokenExpiresAt(calculateAccessTokenExpiration());
          setRefreshTokenExpiresAt(calculateRefreshTokenExpiration());
          const expiryTime = new Date(
            new Date().getTime() + data.expires_in * 1000
          );

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
          const response = await fetch("http://127.0.0.1:5556/token-exchange", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${authString}`,
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: refresh_token,
            }).toString(),
          });

          const data = await response.json();

          if (response.ok) {
            setAccessToken(data.access_token);
            setRefreshToken(data.refresh_token);
          } else {
            throw new Error(`Error refreshing token: ${data.error}`);
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
    };
    fetchAccessToken();
  }, []);

  //! User Profile {userId}
  //* Working
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;
      userImg;
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          // const response = await fetch("http://127.0.0.1:5556/current_user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          setUserId(data.id);
          setDisplayName(data.display_name);
          setUserEmail(data.email);
          setUserImg(data.images[0].url);
          if (data.images && data.images.length > 0) {
            setUserImg(data.images[0].url);
          } else {
            setUserImg(null);
          }
        } else {
          console.error("Error fetching user profile:", response.statusText);
        }
        {
          console.error("Error fetching user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  //! User Saved Tracks
  //* Working
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
  //* Working
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

  const userInformation = {
    name: displayName,
    email: userEmail,
    userId: userId,
    userImage: userImg,
  };

  const tokenInformation = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  useEffect(() => {
    // Ensure all required user information is available
    if (!userId || !displayName || !userEmail || !userImg) return;

    // Define the user information object
    const userInformation = {
      name: displayName,
      email: userEmail,
      userId: userId,
      userImage: userImg,
    };

    // Send user information to the backend
    fetch("http://127.0.0.1:5556/store_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInformation),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  }, [userId, displayName, userEmail, userImg]);

  async function storeTokens(userData) {
    const url = "http://127.0.0.1:5556/store_tokens";
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
    storeTokens();
  }
  useEffect(() => {
    if (
      !accessToken ||
      !refreshToken ||
      !userId ||
      !accessTokenExpiresAt ||
      !refreshTokenExpiresAt
    )
      return;

    const storeTokensInBackend = async () => {
      try {
        const response = await fetch("http://localhost:5556/store_tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires_at: Math.floor(
              accessTokenExpiresAt.getTime() / 1000
            ), // Convert to seconds
            refresh_token_expires_at: Math.floor(
              refreshTokenExpiresAt.getTime() / 1000
            ), // Convert to timestamp
          }),
        });

        const data = await response.json();
        console.log("SRTIB: ", response);
        console.log("Response from backend:", data);
      } catch (error) {
        console.error("Error storing refresh token:", error);
      }
    };

    storeTokensInBackend();
  }, [
    userId,
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  ]);

  return <div></div>;

  // async function storeTokens(
  //   userId,
  //   accessToken,
  //   refreshToken,
  //   accessTokenExpiresAt,
  //   refreshTokenExpiresAt
  // ) {
  //   const url = "http://localhost:5556/store_tokens";
  //   const data = {
  //     user_id: userId,
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //     access_token_expires_at: accessTokenExpiresAt,
  //     refresh_token_expires_at: refreshTokenExpiresAt,
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     console.log("Response:", result);
  //   } catch (error) {
  //     console.error("Error storing tokens:", error);
  //   }
  //   storeTokens(data);
  // }
};

export default SpotifyAuth;
