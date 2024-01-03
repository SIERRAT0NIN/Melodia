import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import SongBasket from "./SongBasket";
import { useSpotify } from "../Spotify/SpotifyContext";

export const CreateSongBasket = ({
  loadSongBasket,
  songCount,
  setSongCount,
}) => {
  const { setSelectedBasketId, jwtUserId } = useSpotify(null);
  const [songBaskets, setSongBaskets] = useState([]);

  const createSongBasketInBackend = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await fetch("http://localhost:5556/create_song_basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: jwtUserId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("New Song Basket Created with ID:", data.basket_id);
      return data.basket_id; // Return the actual basket ID
    } catch (error) {
      console.error("Error creating song basket:", error);
      return null; // Return null in case of error
    }
  };

  const handleAddSongBasket = async () => {
    const basketId = await createSongBasketInBackend();
    if (basketId) {
      setSongBaskets([...songBaskets, { id: basketId }]);
      setSelectedBasketId(basketId);
    }
  };

  return (
    <div>
      <Button variant="shadow" color="secondary" onClick={handleAddSongBasket}>
        Create a new song basket
      </Button>
      {songBaskets.map((basket) => (
        <SongBasket
          key={basket.id}
          id={basket.id}
          loadSongBasket={loadSongBasket}
          songCount={songCount}
          setSongCount={setSongCount}
        />
      ))}
    </div>
  );
};
