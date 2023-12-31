import { useState } from "react";
import { Button } from "@nextui-org/react";
import SongBasket from "./SongBasket";
import { useSpotify } from "../Spotify/SpotifyContext";
export const CreateSongBasket = () => {
  const { setSelectedBasketId } = useSpotify(null);
  const [songBaskets, setSongBaskets] = useState([]);

  const [nextId, setNextId] = useState(0);

  const handleAddSongBasket = () => {
    const newBasket = {
      id: nextId,
      // any other properties you want to include
    };
    setSongBaskets([...songBaskets, newBasket]);
    setNextId(nextId + 1);
    setSelectedBasketId(nextId);
  };

  return (
    <div>
      <Button variant="faded" onClick={handleAddSongBasket}>
        Create a new song basket
      </Button>
      {songBaskets.map((basket, index) => (
        <SongBasket key={basket.id} id={basket.id} />
      ))}
    </div>
  );
};
