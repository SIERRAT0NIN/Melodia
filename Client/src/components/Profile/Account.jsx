import React, { useEffect } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import NavBar from "../Home/NavBar";
import { useNavigate } from "react-router-dom";
import SpotifyTopTracks from "./TopTracks";
import SpotifyTopArtists from "./TopArtist";
// import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const {
    userId,
    displayName,
    userEmail,
    userImg,
    setUserId,
    setDisplayName,
    setUserEmail,
    setUserImg,
  } = useSpotify();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
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
          setUserImg(
            data.images && data.images.length > 0 ? data.images[0].url : null
          );
        } else {
          console.error("Error fetching user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUserId(null);
    setDisplayName(null);
    setUserEmail(null);
    setUserImg(null);
    navigate("/"); // Replace "/login" with your login route
  };

  return (
    <div className="profile-container" style={{ textAlign: "center" }}>
      <NavBar />

      <div className="glassmorphism-profile">
        <img
          className="profile"
          src={userImg}
          alt="Profile"
          // style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
        <h1>{displayName}</h1>
        <h2>{userId}</h2>
        <p>{userEmail}</p>
      </div>
      <div>
        <SpotifyTopTracks userId={userId} accessToken={accessToken} />
        <SpotifyTopArtists userId={userId} accessToken={accessToken} />
      </div>
      <button className=" bn19" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Account;
