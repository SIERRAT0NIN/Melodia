import { createContext, useContext, useState, useEffect } from "react";

export const SpotifyContext = createContext(null);

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [backendToken, setBackendToken] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBasketId, setSelectedBasketId] = useState(null);
  const [jwtUserId, setJwtUserId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistImage, setPlaylistImage] = useState("");
  const [basketData, setBasketData] = useState([]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:5556/get_token/${userId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch access token");
          return;
        }

        const data = await response.json();
        setBackendToken(data.access_token);
      } catch (err) {
        // Handle network errors
        setError(err.message);
      }
    };

    if (userId) {
      fetchAccessToken();
    }
  }, [userId]);

  const handleSongToBasket = (basket_id, response) => {
    setBasketData((currentBaskets) =>
      currentBaskets.map((basket) => {
        if (basket.basket_id === basket_id) {
          const newSongs = response.added_songs.map((song) => ({}));
          return { ...basket, songs: [...basket.songs, ...newSongs] };
        } else {
          return basket;
        }
      })
    );
  };

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
        setSelectedArtist,
        selectedArtist,
        selectedItems,
        setSelectedItems,
        playlists,
        setPlaylists,
        backendToken,
        selectedBasketId,
        setSelectedBasketId,
        jwtUserId,
        setJwtUserId,
        playlistDescription,
        setPlaylistDescription,
        playlistName,
        setPlaylistName,
        playlistImage,
        setPlaylistImage,
        basketData,
        setBasketData,
        handleSongToBasket,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
