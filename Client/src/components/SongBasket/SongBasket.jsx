import { Card, CardFooter, Image, Button, Badge } from "@nextui-org/react";
import BasketSearchModal from "./BasketSearchModal";
import React, { useState } from "react";

export default function SongBasket() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    console.log("Opening Modal");
    setIsOpen(true);
  };
  const onClose = () => setIsOpen(false);
  return (
    <div className="basket-collection" onClick={onOpen}>
      <Badge
        content="5"
        size="lg"
        color="secondary"
        variant="faded"
        placement="top-right"
      >
        <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="Basket cover/Playlist image"
            src="./default_basket.png"
            className="object-cover"
            height={300}
            width={300}
          />

          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 basket-text">
            <p className="basket text-white ">Song Basket</p>
            <Button
              className="text-tiny text-white bg-black/20 "
              variant="shadow"
              color="primary"
              radius="lg"
              size="sm"
            >
              Create into a Spotify playlist
            </Button>
          </CardFooter>
        </Card>
      </Badge>

      <BasketSearchModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
