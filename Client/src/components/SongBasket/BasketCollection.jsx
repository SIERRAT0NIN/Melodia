import React from "react";
import SongBasket from "./SongBasket";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function BasketCollection() {
  return (
    <div className="basket-collection">
      <Container>
        <Row>
          <Col md={3}>
            <SongBasket />
          </Col>
          <Col md={3}>
            <SongBasket />
          </Col>
          <Col md={3}>
            <SongBasket />
          </Col>
          <Col md={3}>
            <SongBasket />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BasketCollection;
