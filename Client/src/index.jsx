import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/Router.jsx";
import "./index.css";
import { AuthProvider } from "./components/AuthContext.jsx";

import { NextUIProvider } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import { SpotifyProvider } from "./components/Spotify/SpotifyContext.jsx";
import Footer from "./components/Home/Footer.jsx";
import NavBar from "./components/Home/NavBar.jsx";
// import App from "./components/App.jsx";
// import LoginBlob from "./components/LoginBlob.jsx";
// import SavedSongTable from "./components/SavedSongTable.jsx";
// import ProfileAvi from "./components/ProfileAvi.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <ScrollShadow>
        <SpotifyProvider>
          <AuthProvider>
            <div className="w-screen h-screen p-8 flex items-start justify-center text-foreground ">
              <App />
            </div>
          </AuthProvider>
        </SpotifyProvider>
      </ScrollShadow>
    </NextUIProvider>
  </React.StrictMode>
);
