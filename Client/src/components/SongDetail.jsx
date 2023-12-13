import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="success">
        Song
      </Button>
      <Modal
        // backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="2x1"
        classNames={{
          body: "py-6",
          //   backdrop: "bg-[#292f46]/50 backdrop-opacity-0",
          base: "border-[#292f46] dark:bg-[#19172c] text-[#000]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Image
                  className="flex "
                  src="https://i.scdn.co/image/ab67616d00001e02651e1dbc0b5218f2306181a1"
                ></Image>
                <h2>Cowgirl (feat. Lourdiz)</h2>
                <h4>Nicki Minaj</h4>
                <h4>Pink Friday 2</h4>
              </ModalHeader>
              <ModalBody>
                <p>Release Data: 2023-12-08</p>
                <p>Artist Bio:</p>
                <p>Popularity:</p>
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={onClose}>
                  Like
                </Button>
                <Button color="success" variant="light" onPress={onClose}>
                  Add to playlist
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
