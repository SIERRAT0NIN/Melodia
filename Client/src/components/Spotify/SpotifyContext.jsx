import { createContext, useContext, useState, useEffect } from "react";

export const SpotifyContext = createContext(null);

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [jwt, setJwt] = useState(null);

  const sendSelectedSongToBackend = async (song) => {
    const songData = {
      id: song.id,
      name: song.name,
      // image: song.images[1].url,
    };
    try {
      const response = await fetch("http://localhost:5556/songbasket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });

      const data = await response.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error sending selected song to backend:", error);
    }
    console.log(songData, "SONG DATA");
  };
  // useEffect hook to call the function when selectedSong changes
  useEffect(() => {
    if (selectedSong) {
      sendSelectedSongToBackend(selectedSong);
    }
  }, [selectedSong]);

  // useEffect(() => {
  //   if (!refreshToken) return;

  //   const storeRefreshTokenInBackend = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:5556/store_refresh_token",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             user_id: userId,
  //             refresh_token: refreshToken,
  //           }),
  //         }
  //       );

  //       const data = await response.json();
  //       console.log("SRTIB: ", response);
  //       console.log("Response from backend:", data);
  //     } catch (error) {
  //       console.error("Error storing refresh token:", error);
  //     }
  //   };

  //   storeRefreshTokenInBackend();
  // }, [userId, refreshToken]);
  // useEffect(() => {
  //   if (!accessToken) return;

  //   const storeTokensInBackend = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5556/store_tokens", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           user_id: userId,
  //           access_token: accessToken,
  //           refresh_token: refreshToken,
  //         }),
  //       });

  //       const data = await response.json();
  //       console.log("SRTIB: ", response);
  //       console.log("Response from backend:", data);
  //     } catch (error) {
  //       console.error("Error storing refresh token:", error);
  //     }
  //   };

  //   storeTokensInBackend();
  // }, [userId, accessToken, refreshToken]);

  // useEffect(() => {
  //   if (!accessToken) return;

  //   const storeAccessTokenInBackend = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:5556/store_tokens", // Update this URL as needed
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             user_id: userId,
  //             access_token: accessToken,
  //           }),
  //         }
  //       );

  //       const data = await response.json();
  //       console.log("Store AccessToken in Backend: ", response);
  //       console.log("Response from backend:", data);
  //     } catch (error) {
  //       console.error("Error storing access token:", error);
  //     }
  //   };

  //   storeAccessTokenInBackend();
  // }, [userId, accessToken]);
  return (
    <SpotifyContext.Provider
      value={{
        accessToken,
        setAccessToken,
        userId,
        setUserId,
        refreshToken,
        setRefreshToken,
        savedTracks,
        setSavedTracks,
        userPlaylists,
        setUserPlaylists,
        selectedSong,
        setSelectedSong,
        displayName,
        userEmail,
        userImg,
        setDisplayName,
        setUserEmail,
        setUserImg,
        accessTokenExpiresAt,
        setAccessTokenExpiresAt,
        refreshTokenExpiresAt,
        setRefreshTokenExpiresAt,
        tokenStatus,
        setTokenStatus,
        jwt,
        setJwt,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
