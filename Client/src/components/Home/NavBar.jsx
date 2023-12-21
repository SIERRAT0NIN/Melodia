import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  // DropdownItem,
  // DropdownTrigger,
  // Dropdown,
  // DropdownMenu,
  // Avatar,
} from "@nextui-org/react";
// import { NextIcon } from "../MusicPlayer/NextIcon.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import Account from "./Account.jsx";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import SpotifySearch from "./SpotifySearch.jsx";
export default function NavBar() {
  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <EqualizerRoundedIcon />
          <p className="hidden sm:block font-bold text-inherit">Melody</p>
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

      <NavbarContent as="div" className="items-center" justify="end">
        {/* <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        /> */}

        <SpotifySearch />

        <Account />
      </NavbarContent>
    </Navbar>
  );
}
