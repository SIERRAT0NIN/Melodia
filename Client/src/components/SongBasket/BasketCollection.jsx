import React from "react";
import SongBasket from "./SongBasket";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CreateSongBasket } from "./CreateSongBasket";
import VerifyJWT from "../Spotify/VerifyJWT";

function BasketCollection() {
  return (
    <Container>
      <VerifyJWT />
      <Row>
        <CreateSongBasket />
      </Row>
    </Container>
  );
}

export default BasketCollection;
