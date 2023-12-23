import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  Button,
  ButtonGroup,
  // DropdownItem,
  // DropdownTrigger,
  // Dropdown,
  // DropdownMenu,
  // Avatar,
} from "@nextui-org/react";
// import { NextIcon } from "../MusicPlayer/NextIcon.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
// import Account from "./Account.jsx";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import SpotifySearch from "../Search/SpotifySearch.jsx";
export default function NavBar() {
  return (
    <>
      <Navbar isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <EqualizerRoundedIcon />
            <p className="hidden sm:block font-bold text-inherit">Melody</p>
            <h1>Melody </h1>
            <ButtonGroup
              variant="bordered"
              color="primary"
              justify="end"
              className="nav-btn"
            >
              <Button className="nav-btn">
                <a href="/saved_songs"> Liked Songs </a>
              </Button>
              <Button className="nav-btn">
                <a href="/user_playlist"> Playlist</a>
              </Button>
              <Button className="nav-btn">
                <a href="/baskets"> Song Baskets</a>
              </Button>
              <Button className="nav-btn">
                <a href="/create_playlist"> Create a playlist</a>
              </Button>
            </ButtonGroup>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex gap-3">
            <NavbarItem>
              <Link color="foreground" href="#">
                Features
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page" color="secondary">
                Customers
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Integrations
              </Link>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <SpotifySearch />
    </>
  );
}
