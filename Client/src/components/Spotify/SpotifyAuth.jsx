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
    setTokenStatus,
    setJwt,
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
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, [setAccessToken]);
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
          localStorage.setItem("accessToken", data.access_token); //! ACCESS TOKEN

          setRefreshToken(data.refresh_token);
          setAccessTokenExpiresAt(calculateAccessTokenExpiration());
          setRefreshTokenExpiresAt(calculateRefreshTokenExpiration());

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

  //! Function to verify JWT token
  const verifyToken = (jwt) => {
    fetch("http://localhost:5556/verify_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: jwt }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Token is valid!") {
          setTokenStatus("valid");
        } else {
          console.error("Token verification failed:", data.message);
          setTokenStatus("invalid");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setTokenStatus("error");
      });
  };

  const fetchJwt = async (userId) => {
    try {
      const response = await fetch("http://localhost:5556/request_jwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setJwt(data.jwt);
        localStorage.setItem("jwtToken", data.jwt); // Store JWT

        verifyToken(data.jwt); // Store the JWT in state
        // JWT will be logged when it's updated in the state
      } else {
        console.error("Error fetching JWT:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching JWT:", error);
    }
  };

  // Add this useEffect to log the JWT when it's updated
  useEffect(() => {
    if (userId) {
      fetchJwt(userId);
    }
  }, [userId]);

  const authenticatedFetch = (url, options = {}) => {
    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem("jwtToken");

    // Check if the JWT token is available
    if (!jwtToken) {
      console.error("JWT token not found in localStorage");
      // Ideally, handle the absence of a JWT token by redirecting to a login page or similar
      return Promise.reject(new Error("JWT token not found"));
    }

    // Merge the Authorization header with any existing headers in the options
    const headersWithAuth = {
      ...(options.headers || {}),
      Authorization: `Bearer ${jwtToken}`,
    };

    // Return the fetch promise with the merged options and headers
    return fetch(url, {
      ...options,
      headers: headersWithAuth,
    })
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          // If not successful, reject the promise with the error message
          return Promise.reject(
            new Error(`HTTP error! Status: ${response.status}`)
          );
        }
        return response.json(); // Assuming the response is JSON
      })
      .catch((error) => {
        // Log and rethrow the error for further handling
        console.error("Error in authenticated fetch:", error);
        throw error;
      });
  };

  useEffect(() => {
    if (accessToken) {
      authenticatedFetch("http://127.0.0.1:5556/user_saved_tracks")
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  }, [accessToken]);
  return <div></div>;
};

export default SpotifyAuth;
