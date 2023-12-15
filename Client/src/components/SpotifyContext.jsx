import { createContext, useContext, useState } from "react";

export const SpotifyContext = createContext(null);

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  // Additional states like isAuthenticated, isLoading, etc. can be added here
  return (
    <SpotifyContext.Provider
      value={{ accessToken, setAccessToken, userId, setUserId }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
