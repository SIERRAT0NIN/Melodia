import { Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import Footer from "./Footer";

const Blob = () => {
  const [isError, setIsError] = useState(false);

  const blobContent = [
    {
      name: "Melodía",
      description: "Your personal music app",
      username: "Sign in with Spotify!",
      className: "linkedin",
    },
  ];

  // const client_secret = "2fb5a9bb603a48aeadc6dfb28eeb00a0";
  // const client_id = "6abb9eac788d42e08c2a50e3f5ff4e53";
  // const redirect_uri = "http://localhost:5555/home";
  const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  const scopes = [
    "user-read-playback-position",
    "user-read-playback-state",
    "user-top-read",
    "user-library-read",
    "user-library-modify",
    "user-read-private",
    "user-read-email",
    "user-read-currently-playing",
    "app-remote-control",
    "streaming",
    "playlist-read-private",
    "user-modify-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
  ];
  useEffect(() => {
    if (!client_id || !client_secret || !redirect_uri) {
      console.error("Spotify credentials are not properly set.");
      setIsError(true); // This will now only run once, when the component mounts
    }
  }, [client_id, client_secret, redirect_uri]); // Dependencies array

  const redirectToSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(
      "%20"
    )}&response_type=code`;
    window.location.href = authUrl;
  };

  return (
    <>
      <div className="flex justify-center gap-4 items-center blob-container">
        {blobContent.map((social) => (
          <div key={social.name} className={`square ${social.className}`}>
            <span></span>
            <span></span>
            <span></span>
            <div className="content">
              <h2>{social.name}</h2>
              <p>{social.description}</p>
              <Button
                color="primary"
                variant="faded"
                onClick={redirectToSpotifyLogin}
              >
                {social.username}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Blob;
