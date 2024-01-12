// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   Button,
//   ButtonGroup,
// } from "@nextui-org/react";
// import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";

// export default function NavBar() {
//   return (
//     <>
//       <Navbar isBordered className="glassmorphism-nav navigation-bar">
//         <NavbarContent justify="space-between">
//           <div className="flex items-center justify-start">
//             <NavbarBrand className="flex items-center mr-4">
//               <EqualizerRoundedIcon />
//               <p className="hidden sm:block font-bold text-inherit ml-2">
//                 Melody
//               </p>
//             </NavbarBrand>
//             <a href="/home">
//               <h1 className="home-nav">Melodía</h1>
//             </a>
//           </div>
//         </NavbarContent>
//         <div className="flex items-center justify-end">
//           <ButtonGroup variant="ghost" className="nav-btn">
//             <Button>
//               <a className="nav-btn" href="/saved_songs">
//                 Liked Songs
//               </a>
//             </Button>
//             <Button>
//               <a className="nav-btn" href="/user_playlist">
//                 Playlist
//               </a>
//             </Button>
//             <Button>
//               <a className="nav-btn" href="/baskets">
//                 Song Baskets
//               </a>
//             </Button>
//             <Button>
//               <a className="nav-btn" href="/account">
//                 Profile
//               </a>
//             </Button>
//           </ButtonGroup>
//         </div>
//       </Navbar>
//     </>
//   );
// }
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Link,
  NavbarMenuItem,
  Button,
  NavbarMenu,
} from "@nextui-org/react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { text: "Profile", href: "/account" },
    { text: "Liked Songs", href: "/liked-songs" },
    { text: "Saved Playlist", href: "/saved-playlist" },
    { text: "Song Basket", href: "/song-basket" },
    { text: "Log Out", href: "/logout" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">Melodìa</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/account">
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          {/* <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button> */}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.text}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href={item.href} // Use href from the menuItems array
              size="lg"
            >
              {item.text} {/* Display the text property of each item */}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
