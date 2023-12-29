import React from "react";
import SongBasket from "./SongBasket";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BasketCheckBox from "./BasketCheckBox";

function BasketCollection() {
  return (
    <Container>
      <BasketCheckBox />
      <Row>
        <Col className="song-basket-col">
          <SongBasket />
        </Col>
      </Row>
    </Container>
  );
}

export default BasketCollection;
