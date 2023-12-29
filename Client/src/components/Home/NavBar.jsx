import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  ButtonGroup,
} from "@nextui-org/react";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import SpotifySearch from "../Search/SpotifySearch.jsx";

export default function NavBar() {
  return (
    <>
      <Navbar isBordered className="glassmorphism-nav">
        <NavbarContent justify="space-between">
          {/* Grouping Brand and Title together on the left */}
          <div className="flex items-center justify-start">
            <NavbarBrand className="flex items-center mr-4">
              <EqualizerRoundedIcon />
              <p className="hidden sm:block font-bold text-inherit ml-2">
                Melody
              </p>
            </NavbarBrand>
            <h1>Melodía</h1>
          </div>
        </NavbarContent>
        <div className="flex items-center justify-end">
          <ButtonGroup variant="ghost" className="nav-btn">
            <Button className="nav-btn">
              <a href="/saved_songs">Liked Songs</a>
            </Button>
            <Button className="nav-btn">
              <a href="/user_playlist">Playlist</a>
            </Button>
            <Button className="nav-btn">
              <a href="/baskets">Song Baskets</a>
            </Button>
            <Button className="nav-btn">
              <a href="/create_playlist">Create a playlist</a>
            </Button>
          </ButtonGroup>
        </div>
      </Navbar>
      {/* <SpotifySearch /> */}
    </>
  );
}
