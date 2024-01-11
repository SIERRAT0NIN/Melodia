import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  ButtonGroup,
} from "@nextui-org/react";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";

export default function NavBar() {
  return (
    <>
      <Navbar isBordered className="glassmorphism-nav">
        <NavbarContent justify="space-between">
          <div className="flex items-center justify-start">
            <NavbarBrand className="flex items-center mr-4">
              <EqualizerRoundedIcon />
              <p className="hidden sm:block font-bold text-inherit ml-2">
                Melody
              </p>
            </NavbarBrand>
            <a href="/home">
              <h1 className="home-nav">Melodía</h1>
            </a>
          </div>
        </NavbarContent>
        <div className="flex items-center justify-end">
          <ButtonGroup variant="ghost" className="nav-btn">
            <Button>
              <a className="nav-btn" href="/saved_songs">
                Liked Songs
              </a>
            </Button>
            <Button>
              <a className="nav-btn" href="/user_playlist">
                Playlist
              </a>
            </Button>
            <Button>
              <a className="nav-btn" href="/baskets">
                Song Baskets
              </a>
            </Button>
            <Button>
              <a className="nav-btn" href="/account">
                Profile
              </a>
            </Button>
          </ButtonGroup>
        </div>
      </Navbar>
    </>
  );
}
