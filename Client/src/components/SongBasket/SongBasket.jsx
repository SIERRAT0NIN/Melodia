import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function App() {
  return (
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
          // color="success"
          radius="lg"
          size="sm"
        >
          Create into a Spotify playlist
        </Button>
      </CardFooter>
    </Card>
  );
}
