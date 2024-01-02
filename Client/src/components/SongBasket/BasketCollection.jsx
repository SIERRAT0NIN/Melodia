import React, { useState, useEffect } from "react";
import SongBasket from "./SongBasket";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CreateSongBasket } from "./CreateSongBasket";
import VerifyJWT from "../Spotify/VerifyJWT";
import Button from "react-bootstrap/Button";
import { useSpotify } from "../Spotify/SpotifyContext";
function BasketCollection() {
  const [basket, setBasket] = useState([]);
  const { jwtUserId } = useSpotify();
  const [basketData, setBasketData] = useState(null);

  const loadSongBasket = () => {
    fetch(`http://localhost:5556/song_basket/${jwtUserId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Basket Data: ", data);
        setBasketData(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  useEffect(() => {
    loadSongBasket();
  }, []);

  console.log(basketData);
  return (
    <Container>
      <VerifyJWT />
      <Row>
        <CreateSongBasket />
      </Row>
      <Row>
        <Col>
          <Button onClick={loadSongBasket}>Load My Song Basket</Button>
        </Col>
      </Row>
      {basketData && (
        <Row>
          <Col>
            <div>Basket ID: {basketData.basket.basket_id}</div>
            <h3>Songs:</h3>
            {basketData.songs.length > 0 ? (
              basketData.songs.map((song, index) => (
                <div key={index}>
                  Song: {song.track_name}, Artist: {song.track_artist}
                </div>
              ))
            ) : (
              <p>No songs in basket</p>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default BasketCollection;
