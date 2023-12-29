import React from "react";
import { Card, CardFooter, Image, Button, Modal } from "@nextui-org/react";
import defaultArtistImage from "./default-artist.jpg";

export default function SearchArtistModal({ isOpen, onClose, artistData }) {
  // Fallback image if no artist image is provided
  let artistImage = artistData.images[1].url || defaultArtistImage;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card isFooterBlurred radius="lg" className="border-none">
        <Image
          alt={artistData?.name || "Artist"}
          className="object-cover"
          height={200}
          src={artistImage}
          width={200}
        />

        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <div>
            <p className="text-small text-white/80">
              {artistData?.name || "Artist Name"}
            </p>
            <p className="text-tiny text-white/60">
              {artistData?.genres?.join(", ") || "Genres"}
            </p>
          </div>
          <Button
            className="text-tiny text-white bg-black/20"
            variant="flat"
            color="default"
            radius="lg"
            size="sm"
          >
            Notify me
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
