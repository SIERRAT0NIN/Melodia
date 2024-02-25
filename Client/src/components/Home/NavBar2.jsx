import { Button, ButtonGroup } from "@nextui-org/react";

const Navbar2 = () => {
  const menuItems = [
    { text: "Home", href: "/home" },
    { text: "Profile", href: "/account" },
    { text: "Liked Songs", href: "/saved_songs" },
    { text: "Saved Playlist", href: "/user_playlist" },
    { text: "Song Basket", href: "/baskets" },
    { text: "Log Out", href: "/logout" },
  ];

  return (
    <div className="w-max mx-auto rounded-lg ">
      <nav className="bg-white shadow-md p-4 rounded-lg m-5 hidden md:block">
        <div className="container mx-auto flex justify-center items-center m-5">
          <a
            href="/home"
            className="text-3xl text-black font-bold opacity-100 pacifico "
          >
            Melodìa
          </a>
          <div className="p-5 ">
            <a href="/home" className="px-4">
              Home
            </a>
            <a href="/account" className="px-4">
              Profile
            </a>
            {/* <a href="/saved_songs" className="px-4">
              Saved Songs
            </a>
            <a href="/playlist" className="px-4">
              Playlist
            </a> */}
            <a href="/baskets" className="px-4">
              Song Basket
            </a>
            <a href="/logout" className="px-4">
              Logout
            </a>
          </div>
        </div>
      </nav>
      <div>
        <div className=" ">
          <ButtonGroup
            variant="ghost"
            className="btm-nav fixed bottom-0 inset-x-0 bg-white shadow-md p-4 flex justify-around md:hidden z-10"
          >
            <Button href="/home">
              <a href="/home">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </a>
            </Button>
            <Button className="">
              <a href="/baskets">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </a>
            </Button>
            <Button>
              <a href="/account">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </a>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
