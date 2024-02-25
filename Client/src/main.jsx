import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/Router.jsx";
import "./index.css";

import { NextUIProvider } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import { SpotifyProvider } from "./components/Spotify/SpotifyContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <ScrollShadow>
        <SpotifyProvider>
          <div className="items-start justify-center text-foreground responsive-wrapper">
            <App />
          </div>
        </SpotifyProvider>
      </ScrollShadow>
    </NextUIProvider>
  </React.StrictMode>
);
