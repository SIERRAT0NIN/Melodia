import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const Album = ({ isOpen, onClose, tracks }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader>
        <h3>Album Tracks</h3>
      </ModalHeader>
      <ModalBody>
        {tracks.map((track, index) => (
          <div key={index}>{track.name}</div>
        ))}
      </ModalBody>
    </Modal>
  );
};

export default Album;
