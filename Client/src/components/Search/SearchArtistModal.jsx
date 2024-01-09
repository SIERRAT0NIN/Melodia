import React from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  Modal,
  ModalContent,
} from "@nextui-org/react";

export default function SearchArtistModal({ isOpen, onClose, artistData }) {
  let artistImage = artistData.images[0].url;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt={artistData?.name || "Artist"}
            className="object-cover "
            height={500}
            src={artistImage}
            width={6000}
          />

          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="lg"
            >
              <a href={artistData.external_urls.spotify}>{artistData.name}</a>
            </Button>
          </CardFooter>
        </Card>
      </ModalContent>
    </Modal>
  );
}
