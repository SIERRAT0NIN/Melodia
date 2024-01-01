import React, { useState, useEffect } from "react";
import { useSpotify } from "./SpotifyContext";
const VerifyJWT = () => {
  const { jwtUserId, setJwtUserId } = useSpotify();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setErrorMessage("No JWT token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:5556/verify_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: jwtToken }),
      });

      const data = await response.json();
      if (response.ok && data.message === "Token is valid!") {
        setIsTokenValid(true);
        setJwtUserId(data.user_id); // Log or use the user_id as needed
        // Perform further actions based on the user_id
      } else {
        setIsTokenValid(false);
        setErrorMessage(data.message || "Error verifying token");
      }
    } catch (error) {
      console.error("Error during token verification:", error);
      setErrorMessage("Error during token verification");
    }
  };

  console.log("JWT User Id: ", jwtUserId);
  return (
    <div>
      {errorMessage ? (
        <p>Error: {errorMessage}</p>
      ) : (
        <p>Token is {isTokenValid ? "valid" : "invalid"}.</p>
      )}
    </div>
  );
};

export default VerifyJWT;
