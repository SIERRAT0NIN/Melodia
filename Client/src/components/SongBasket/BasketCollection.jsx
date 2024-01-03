import React, { useState, useEffect } from "react";
import SongBasket from "./SongBasket";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import { CreateSongBasket } from "./CreateSongBasket";
import VerifyJWT from "../Spotify/VerifyJWT";
import Button from "react-bootstrap/Button";
import { useSpotify } from "../Spotify/SpotifyContext";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
} from "@nextui-org/react";
import NavBar from "../Home/NavBar";
function BasketCollection() {
  // const [basket, setBasket] = useState([]);
  const { jwtUserId } = useSpotify();
  const [basketData, setBasketData] = useState([]);
  const [songCount, setSongCount] = useState(0); // New state for song count

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
        setSongCount(data.songs.length); // Update song count based on fetched data
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
  }, [jwtUserId]);

  console.log(basketData);
  return (
    <div>
      <NavBar />
      <VerifyJWT />
      <div>
        <CreateSongBasket
          loadSongBasket={loadSongBasket}
          setSongCount={setSongCount}
          songCount={songCount}
        />
      </div>
      <div className="glassmorphism-basket">
        {basketData.map((basket, index) => (
          <div key={basket.basket_id}>
            <h3>Basket ID: {basket.basket_id}</h3>
            <Table striped>
              <TableHeader>
                <TableColumn>Song</TableColumn>
                <TableColumn>Artist</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody>
                {basket.songs.length > 0 ? (
                  basket.songs.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell>{song.track_name}</TableCell>
                      <TableCell>
                        {song.track_artist || "Unknown Artist"}
                      </TableCell>
                      <TableCell>
                        <Image
                          className="basket-img"
                          src={song.track_image}
                        ></Image>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No songs in basket</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BasketCollection;
