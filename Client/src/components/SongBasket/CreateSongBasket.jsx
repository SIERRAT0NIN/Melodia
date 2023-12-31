import { useState } from "react";
import { Button } from "@nextui-org/react";
import SongBasket from "./SongBasket";

export const CreateSongBasket = () => {
  const [songBaskets, setSongBaskets] = useState([]);

  const handleAddSongBasket = () => {
    setSongBaskets([...songBaskets, {}]);
  };

  return (
    <div>
      <Button variant="faded" onClick={handleAddSongBasket}>
        Create a new song basket
      </Button>
      {songBaskets.map((_, index) => (
        <SongBasket key={index} />
      ))}
    </div>
  );
};
