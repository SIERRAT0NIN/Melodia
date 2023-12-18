import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Image,
  Button,
  Slider,
  Spinner,
} from "@nextui-org/react";
import { HeartIcon } from "../Home/HeartIcon";
import { PauseCircleIcon } from "./PauseCircleIcon";
import { NextIcon } from "./NextIcon";
import { PreviousIcon } from "./PreviousIcon";
import { RepeatOneIcon } from "./RepeatOneIcon";
import { ShuffleIcon } from "./ShuffleIcon";

export default function CurrentlyPlayingCard({ accessToken }) {
  const [liked, setLiked] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        if (!accessToken) {
          console.error("Access token is null");
          return;
        }

        const response = await fetch(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setCurrentlyPlaying(data);
        } else {
          console.error("Failed to fetch currently playing track");
          setError("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching currently playing track:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyPlaying();
  }, [accessToken]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!currentlyPlaying || !currentlyPlaying.item) {
    return <p>No currently playing track.</p>;
  }

  const { item } = currentlyPlaying;
  const albumImageUrl = item.album.images[0]?.url;
  const trackName = item.name;
  const artistName = item.artists.map((artist) => artist.name).join(", ");

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              alt="Album cover"
              className="object-cover"
              height={200}
              shadow="md"
              src={albumImageUrl}
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="font-semibold text-foreground/90">
                  {trackName}
                </h3>
                <p className="text-small text-foreground/80">{artistName}</p>
                {/* Additional details can be added here */}
              </div>
              <Button
                isIconOnly
                className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                radius="full"
                variant="light"
                onPress={() => setLiked((v) => !v)}
              >
                <HeartIcon
                  className={liked ? "[&>path]:stroke-transparent" : ""}
                  fill={liked ? "currentColor" : "none"}
                />
              </Button>
            </div>

            {/* ...remaining component structure... */}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
// const Blob = () => {
//   const blobContent = [
//     {
//       name: "Melody",
//       description: "Your personal music app",
//       url: "http://127.0.0.1:5556/token-exchange",
//       username: "Sign in with Spotify!",
//       className: "linkedin",
//     },
//   ];

//   return (
//     <div>
//       {blobContent.map((social, index) => (
//         <div key={index} className={`square ${social.className}`}>
//           <span></span>
//           <span></span>
//           <span></span>
//           <div className="content">
//             <h2>{social.name}</h2>
//             <p>{social.description}</p>
//             <a href={social.url} rel="noopener noreferrer">
//               {social.username}
//             </a>
//           </div>
//         </div>
//       ))}
//     </div>
//     // <div>
//     //   {blobContent.map((social, index) => (
//     //     <div key={index} className={`square ${social.className}`}>
//     //       <span></span>
//     //       <span></span>
//     //       <span></span>
//     //       <div className="content">
//     //         <h2>{social.name}</h2>
//     //         <p>{social.description}</p>
//     //         <a href={social.url} rel="noopener noreferrer">
//     //           {social.username}
//     //         </a>
//     //       </div>
//     //     </div>
//     //   ))}
//     // </div>
//   );
// };

// export  Blob;
