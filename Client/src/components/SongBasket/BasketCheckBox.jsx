import React, { useState } from "react";
import {
  CheckboxGroup,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";

export default function BasketCheckBox() {
  const [selected, setSelected] = useState([null]);

  return (
    <Modal>
      <ModalBody>
        <div className="flex flex-col gap-3">
          <CheckboxGroup
            label="Select basket"
            color="warning"
            value={selected}
            onValueChange={setSelected}
          >
            <Checkbox value="song-basket1">Song Basket1</Checkbox>
            <Checkbox value="song-basket2">Song Basket2</Checkbox>
            <Checkbox value="song-basket3">Song Basket3</Checkbox>
          </CheckboxGroup>
          <p className="text-default-500 text-small">
            Selected: {selected.join(" ")}
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}

//This component will be in the song details to add song to a basket before
