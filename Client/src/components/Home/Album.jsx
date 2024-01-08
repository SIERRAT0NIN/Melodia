import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const Album = ({ isOpen, onClose, tracks }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Album Tracks</ModalHeader>
      <ModalBody>
        <div>
          {tracks.map((track, index) => (
            <div key={track.id || index}>
              <strong>{track.name}</strong>
              {/* Add more track details if needed */}
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default Album;
