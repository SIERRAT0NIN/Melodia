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
    setUserImage,
    setDisplayName,
    setUserEmail,
    setUserImg,
    displayName,
    userEmail,
    userImage,
    userId,
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
      console.log("Creating authorization code: ", authorizationCode);
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
        console.log("exchange token: ", data);

        if (response.ok) {
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          const expiryTime = new Date(
            new Date().getTime() + data.expires_in * 1000
          );

          console.log("Token expires at:", expiryTime);

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
            console.log(
              "*refreshAccessToken function-- Access Token: ",
              accessToken,
              "Refresh Token: ",
              refreshToken
            );
          } else {
            throw new Error(`Error refreshing token: ${data.error}`);
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
    };
    //Gets another access token
    fetchAccessToken();
  }, []);

  console.log("Access:", accessToken);
  console.log("Refresh:", refreshToken);
  // useEffect(() => {
  //   fetch("http://127.0.0.1:5556/token-exchange")
  //     .then((r) => r.json())
  //     .then((data) => console.log("TOKEN:", data))
  //     .catch(Error);
  // }, []);

  //! Refreshing Access Token with Refresh Token from the back end
  // const refreshAccessToken = async () => {
  //   try {
  //     const response = await fetch("/refresh_token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ user_id: userId }),
  //     });

  //     const data = await response.json();
  //     if (data.access_token) {
  //       setAccessToken(data.access_token); // Update your access token state
  //     }
  //   } catch (error) {
  //     console.error("Error refreshing access token:", error);
  //   }
  // };

  //! User Profile {userId}
  //* Working
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

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
          console.log("Response:", response);
          console.log("User Profile:", data);
          setUserId(data.id);
          setDisplayName(data.display_name);
          setUserEmail(data.email);
          if (data.images && data.images.length > 0) {
            setUserImg(data.images[0].url); // Use the first image URL
          } else {
            setUserImg(null); // Or set a default image URL
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
  console.log("ALL DATA:", userId, displayName, userEmail, userImage);

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

  //! Add song to playlist
  // const addSongToPlaylist = async (playlistId, trackUri) => {
  //   if (!accessToken || !playlistId || !trackUri) {
  //     console.error("Missing required information");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           uris: [trackUri],
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       console.log("Track added to the playlist successfully");
  //     } else {
  //       console.error(
  //         "Error adding track to the playlist:",
  //         response.statusText
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error adding track to the playlist:", error);
  //   }
  // };

  // fetch("http://127.0.0.1:5556/current_user", {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log("Current User", data);
  //     setDisplayName(data.display_name);
  //     setUserEmail(data.email);
  //     setUserId(data.id);
  //     setUserImage(data.images[0].url);
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
  const userInformation = {
    name: displayName,
    email: userEmail,
    userId: userId,
    userImage: userImage,
  };
  console.log(userInformation);

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

  return (
    <div>
      <h1>Melody</h1>
    </div>
  );
};

export default SpotifyAuth;
