// import { Card, CardFooter, Image, Button, Badge } from "@nextui-org/react";
// import BasketSearchModal from "./BasketSearchModal";
// import CreatePlaylist from "../Playlist/CreatePlaylist";
// import React, { useState } from "react";

// export default function SongBasket({ id, loadSongBasket }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const onOpen = () => {
//     console.log("Opening Modal");
//     setIsOpen(true);
//   };
//   const onClose = () => setIsOpen(false);

//   return (
//     <div className="basket-collection" onClick={onOpen}>
//       <Badge
//         content="0" //useState to track the number of songs in the basket
//         size="lg"
//         color="secondary"
//         variant="faded"
//         placement="top-right"
//       >
//         <Card isFooterBlurred radius="lg" className="border-none">
//           <Image
//             alt="Basket cover/Playlist image"
//             src="./default_basket.png"
//             className="object-cover"
//             height={300}
//             width={300}
//           />

//           <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 basket-text">
//             <p className="basket text-white ">Song Basket</p>
//             <>
//               <Button
//                 className="text-tiny text-black bg-black/20 "
//                 variant="ghost"
//                 color="secondary"
//                 radius="lg"
//                 size="sm"
//               >
//                 Create into a Spotify playlist
//               </Button>
//             </>
//           </CardFooter>
//           <CreatePlaylist />
//           <Button color="danger" onClick={loadSongBasket}>
//             Load My Song Basket
//           </Button>
//         </Card>
//       </Badge>

//       <BasketSearchModal isOpen={isOpen} onClose={onClose} />
//     </div>
//   );
// }
import React, { useState } from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
} from "@nextui-org/react";
import BasketSearchModal from "./BasketSearchModal";
import CreatePlaylist from "../Playlist/CreatePlaylist";

export default function SongBasket({ id, loadSongBasket, songCount }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] =
    useState(false);
  // const [songCount, setSongCount] = useState(0); // New state for song count

  const onSearchModalOpen = () => {
    console.log("Opening Search Modal");
    setIsSearchModalOpen(true);
  };
  const onSearchModalClose = () => setIsSearchModalOpen(false);

  const onCreatePlaylistModalOpen = () => {
    console.log("Opening Create Playlist Modal");
    setIsCreatePlaylistModalOpen(true);
  };
  const onCreatePlaylistModalClose = () => setIsCreatePlaylistModalOpen(false);

  return (
    <div className="basket-collection" onClick={onSearchModalOpen}>
      <Badge
        content={songCount} // Set the content of the badge dynamically
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
            <>
              <Button
                className="text-tiny text-black bg-black/20"
                variant="ghost"
                color="secondary"
                radius="lg"
                size="sm"
                onClick={onCreatePlaylistModalOpen}
              >
                Create into a Spotify playlist
              </Button>
            </>
          </CardFooter>
          <Button color="danger" onClick={loadSongBasket}>
            Load My Song Basket
          </Button>
        </Card>
      </Badge>

      <BasketSearchModal
        isOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
      />

      {/* Create Playlist Modal */}
      <Modal
        open={isCreatePlaylistModalOpen}
        onClose={onCreatePlaylistModalClose}
      >
        <ModalHeader>
          <h3>Create Playlist</h3>
        </ModalHeader>
        <ModalBody>
          <CreatePlaylist />
        </ModalBody>
      </Modal>
    </div>
  );
}
