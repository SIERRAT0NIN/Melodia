import React, { useEffect } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import NavBar from "../Home/NavBar";
import { useNavigate } from "react-router-dom";
import SpotifyTopTracks from "./TopTracks";
import SpotifyTopArtists from "./TopArtist";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@nextui-org/react";
import Navbar2 from "../Home/NavBar2";
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
            data.images && data.images.length > 0 ? data.images[1].url : null
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
    navigate("/");
  };

  return (
    <div className="profile-container" style={{ textAlign: "center" }}>
      <Navbar2 />

      <div className="glassmorphism-profile">
        <img className="profile" src={userImg} alt="Profile" />
        <h1>{displayName}</h1>
        <h2>{userId}</h2>
        <p>{userEmail}</p>
      </div>
      <div>
        <SpotifyTopTracks userId={userId} accessToken={accessToken} />
        <SpotifyTopArtists userId={userId} accessToken={accessToken} />
      </div>
      <Button variant="shadow" color="danger" className="m-5" onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Account;
