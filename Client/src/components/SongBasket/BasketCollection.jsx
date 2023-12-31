import React from "react";
import SongBasket from "./SongBasket";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CreateSongBasket } from "./CreateSongBasket";

function BasketCollection() {
  return (
    <Container>
      <Row>
        <Col className="song-basket-col">
          <CreateSongBasket />
        </Col>
      </Row>
    </Container>
  );
}

export default BasketCollection;
