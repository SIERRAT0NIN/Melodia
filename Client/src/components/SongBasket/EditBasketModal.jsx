import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const EditBasketModal = ({
  isOpen,
  onClose,
  basketInfo,
  updateBasket,
  jwtUserId,
  loadSongBasket,
  name,
  setName,
  description,
  setDescription,
  image,
  setImage,
}) => {
  // const [name, setName] = useState(basketInfo.playlist_name);
  // const [description, setDescription] = useState(
  //   basketInfo.playlist_description
  // );
  // const [image, setImage] = useState(basketInfo.playlist_img);
  const initialValues = {
    name: basketInfo.playlist_name || "",
    description: basketInfo.playlist_description || "",
    image: basketInfo.playlist_img || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    image: Yup.string().url("Invalid URL").required("Required"),
  });

  const handleSubmit = (values) => {
    const updatedData = {
      playlist_name: values.name,
      playlist_description: values.description,
      playlist_img: values.image,
    };
    // Rest of your update logic
  };
  const handleUpdate = (values) => {
    const updatedData = {
      playlist_name: values.name,
      playlist_description: values.description,
      playlist_img: values.image,
    };

    fetch(
      `http://localhost:5556/song_basket/${jwtUserId}/${basketInfo.basket_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        loadSongBasket(); // Reload to show updated data
        onClose(); // Close the modal after successful update
      })
      .catch((error) => {
        console.error("Error updating basket:", error);
      });
  };

  useEffect(() => {
    setName(basketInfo.playlist_name);
    setDescription(basketInfo.playlist_description);
    setImage(basketInfo.playlist_img);
  }, [basketInfo]);

  //   return (
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalHeader>Edit Basket</ModalHeader>
  //       <ModalBody>
  //         <Input
  //           label="Basket Name"
  //           value={basketInfo.playlist_name}
  //           onChange={(e) => (basketInfo.playlist_name = e.target.value)}
  //         />
  //         <Input
  //           label="Basket Description"
  //           value={basketInfo.playlist_description}
  //           placeholder={basketInfo.playlist_description}
  //           onChange={(e) => (basketInfo.playlist_description = e.target.value)}
  //         />
  //         <Input
  //           label="Basket Image URL"
  //           value={basketInfo.playlist_img}
  //           placeholder={basketInfo.playlist_img}
  //           onChange={(e) => (basketInfo.playlist_img = e.target.value)}
  //         />
  //       </ModalBody>
  //       <ModalFooter>
  //         <Button onClick={onClose}>Cancel</Button>
  //         <Button onClick={handleUpdate}>Update</Button>
  //       </ModalFooter>
  //     </Modal>
  //   );
  // };

  // export default EditBasketModal;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Edit Basket</ModalHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <ModalBody>
              <Field name="name" as={Input} label="Basket Name" />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}

              <Field name="description" as={Input} label="Basket Description" />
              {errors.description && touched.description ? (
                <div>{errors.description}</div>
              ) : null}

              <Field name="image" as={Input} label="Basket Image URL" />
              {errors.image && touched.image ? <div>{errors.image}</div> : null}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit">Update</Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditBasketModal;
