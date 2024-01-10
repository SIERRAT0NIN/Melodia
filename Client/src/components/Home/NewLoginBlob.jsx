import { Link } from "react-router-dom";

const Blob = () => {
  const blobContent = [
    {
      name: "Melodía",
      description: "Your personal music app",
      // url: "https://melodia.netlify.app/home",
      username: "Sign in with Spotify!",
      className: "linkedin",
    },
  ];
  const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes =
    "user-read-playback-position user-read-playback-state user-top-read user-library-read user-library-modify user-read-private user-read-email user-read-currently-playing app-remote-control streaming playlist-read-private user-modify-playback-state playlist-modify-public playlist-modify-private";

  const redirectToSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(
      "%20"
    )}&response_type=code`;

    window.location.href = authUrl;
  };
  return (
    <div>
      {blobContent.map((social, index) => (
        <div key={index} className={`square ${social.className}`}>
          <span></span>
          <span></span>
          <span></span>
          <div className="content">
            <h2>{social.name}</h2>
            <p>{social.description}</p>
            <Link to={redirectToSpotifyLogin}>{social.username}</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blob;
