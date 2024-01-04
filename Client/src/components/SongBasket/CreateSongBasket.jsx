import { useState } from "react";
import SongBasket from "./SongBasket";
import { useSpotify } from "../Spotify/SpotifyContext";
import Snackbar from "@mui/material/Snackbar";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export const CreateSongBasket = ({
  loadSongBasket,
  songCount,
  setSongCount,
  name,
  description,
  image,
}) => {
  const {
    setSelectedBasketId,
    jwtUserId,
    setPlaylistName,
    setPlaylistDescription,
    playlistDescription,
    playlistName,
    basketId,
    playlistImage,
    setPlaylistImage,
  } = useSpotify(null);
  const [songBaskets, setSongBaskets] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const createSongBasketInBackend = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    try {
      const response = await fetch("http://localhost:5556/create_song_basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: jwtUserId,
          playlist_name: playlistName,
          playlist_description: playlistDescription,
          basket_id: basketId,
          playlist_img: playlistImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("New Song Basket Created with ID:", data.basket_id);
      return data.basket_id;
    } catch (error) {
      console.error("Error creating song basket:", error);
      return null;
    }
  };

  const initialValues = {
    name: "",
    description: "",
    image: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    image: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { validateForm }) => {
    const errors = await validateForm();
    if (Object.keys(errors).length) {
      const firstError = Object.values(errors)[0];
      setSnackbarMessage(firstError);
      setSnackbarOpen(true);
      return;
    }

    const basketId = await createSongBasketInBackend(values);
    if (basketId) {
      setSongBaskets([...songBaskets, { id: basketId }]);
      setSelectedBasketId(basketId);
      setIsModalVisible(false);
      loadSongBasket();
    }
  };

  const handleValidation = (errors) => {
    const firstError = Object.values(errors)[0];
    setSnackbarMessage(firstError);
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>
        Create a new song basket
      </Button>

      <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <ModalContent>
          <ModalHeader>Create New Playlist</ModalHeader>
          <Formik
            initialValues={{ name: "", description: "", image: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <ModalBody>
                  <Field name="name" as={Input} placeholder="Basket Name" />
                  {errors.name && touched.name ? (
                    <div>{errors.name}</div>
                  ) : null}

                  <Field
                    name="description"
                    as={Input}
                    placeholder="Basket Description"
                  />
                  {errors.description && touched.description ? (
                    <div>{errors.description}</div>
                  ) : null}

                  <Field name="image" as={Input} placeholder="Basket Image" />
                  {errors.image && touched.image ? (
                    <div>{errors.image}</div>
                  ) : null}
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="button"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Close
                  </Button>
                  <Button type="submit">Create</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>

      {songBaskets.map((basket) => (
        <SongBasket
          key={basket.id}
          id={basket.id}
          loadSongBasket={loadSongBasket}
        />
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};
