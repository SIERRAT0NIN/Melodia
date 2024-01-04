import React, { useEffect } from "react";
import { useSpotify } from "../Spotify/SpotifyContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate(); // For redirecting after logout

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) return;
      userImg;
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
          setUserImg(data.images[1].url);
          if (data.images && data.images.length > 0) {
            setUserImg(data.images[1].url);
          } else {
            setUserImg(null);
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
      <img
        src={userImg}
        alt="Profile"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <h1>{displayName}</h1>
      <h2>{userId}</h2>
      <p>{userEmail}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Account;
