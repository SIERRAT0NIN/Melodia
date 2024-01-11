const Blob = () => {
  const blobContent = [
    {
      name: "Melodía",
      description: "Your personal music app",
      username: "Sign in with Spotify!",
      className: "linkedin",
    },
  ];
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
  if (!client_id || !client_secret || !redirect_uri) {
    console.error("Spotify credentials are not properly set.");
    return;
  }

  const redirectToSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(
      "%20"
    )}&response_type=code`;
    window.location.href = authUrl;
  };
  return (
    <div>
      {blobContent.map((social) => (
        <div key={social.name} className={`square ${social.className}`}>
          <span></span>
          <span></span>
          <span></span>
          <div className="content">
            <h2>{social.name}</h2>
            <p>{social.description}</p>
            <button onClick={redirectToSpotifyLogin}>{social.username}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blob;
