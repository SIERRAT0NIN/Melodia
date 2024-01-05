import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Image,
  Button,
  Slider,
  Spinner,
} from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import { NextIcon } from "./NextIcon";
import { PauseCircleIcon } from "./PauseCircleIcon";

import { RepeatOneIcon } from "./RepeatOneIcon";
import { ShuffleIcon } from "./ShuffleIcon";
import { PreviousIcon } from "./PreviousIcon";
import { useSpotify } from "../Spotify/SpotifyContext";

export default function CurrentlyPlayingCard() {
  const [liked, setLiked] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setAccessToken } = useSpotify();
  const [songPosition, setSongPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  const storedAccessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!storedAccessToken) {
      console.error("Access token is null");
      setError("Access token is not available");
      setLoading(false);
      return;
    }

    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: { Authorization: `Bearer ${storedAccessToken}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch currently playing track");
        }

        const data = await response.json();
        setCurrentlyPlaying(data);
        setSongPosition(data.progress_ms);
        setIsPlaying(data.is_playing);
      } catch (error) {
        console.error("Error fetching currently playing track:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentlyPlaying();
  }, [currentlyPlaying]); // Remove setAccessToken if you're not using it in the fetch

  const handleNextPrevious = async (direction) => {
    try {
      await fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${storedAccessToken}` },
      });
    } catch (error) {
      console.error(`Error with ${direction} track:`, error);
    }
  };

  const togglePlayPause = async () => {
    try {
      const endpoint = isPlaying ? "pause" : "play";
      await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${storedAccessToken}` },
      });
      setIsPlaying(!isPlaying); // Toggle the state
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const handleSliderChange = async (newValue) => {
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${newValue}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        }
      );
      setSongPosition(newValue);
    } catch (error) {
      console.error("Error seeking track:", error);
    }
  };

  if (loading) return <Spinner size="lg" color="warning" />;
  if (error) return <p>Error: {error}</p>;
  if (!currentlyPlaying || !currentlyPlaying.item)
    return <p>No currently playing track.</p>;

  const handlePrevious = async () => {
    handleNextPrevious("previous");
  };

  const handleNext = async () => {
    handleNextPrevious("next");
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] "
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center ">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              alt="Album cover"
              className="object-cover"
              height={200}
              shadow="md"
              src={currentlyPlaying.item.album.images[0].url} // Dynamically set the album cover
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="font-semibold text-foreground/90">
                  {currentlyPlaying.item.name}
                </h3>
                <p className="text-small text-foreground/80">
                  {currentlyPlaying.item.artists
                    .map((artist) => artist.name)
                    .join(", ")}
                </p>
                <h1 className="text-large font-medium mt-2">
                  {currentlyPlaying.item.album.name}
                </h1>
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

            <div className="flex flex-col mt-3 gap-1">
              <Slider
                aria-label="Music progress"
                classNames={{
                  track: "bg-default-500/30",
                  thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                }}
                color="foreground"
                value={songPosition} // Bind the slider value to the song's current position
                onChange={handleSliderChange}
                size="sm"
                max={currentlyPlaying?.item?.duration_ms || 0} // Set the maximum value to the duration of the song
              />
              <div className="flex justify-between">
                <p className="text-small">{formatTime(songPosition)}</p>
                <p className="text-small text-foreground/50">
                  {formatTime(currentlyPlaying?.item?.duration_ms)}
                </p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <RepeatOneIcon className="text-foreground/80" />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onClick={handlePrevious}
              >
                <PreviousIcon />
              </Button>
              <Button
                isIconOnly
                className="w-auto h-auto data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <PauseCircleIcon size={54} />
                ) : (
                  <PauseCircleIcon size={54} />
                )}{" "}
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onClick={handleNext}
              >
                <NextIcon />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <ShuffleIcon className="text-foreground/80" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
