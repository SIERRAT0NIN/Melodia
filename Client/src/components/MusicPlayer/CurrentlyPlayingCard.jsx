import { useEffect, useState, useRef, useCallback } from "react";
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

export default function CurrentlyPlayingCard() {
  const [liked, setLiked] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songPosition, setSongPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pollInterval = 1000; // Poll every 1000 milliseconds (1 second)
  const intervalIdRef = useRef(null); // Use useRef to persist interval ID

  // Refactor fetch call into a separate function
  const fetchApi = useCallback(async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  }, []);

  const storedAccessToken = (() => {
    try {
      return localStorage.getItem("accessToken");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setError("Local storage is not accessible");
      return null;
    }
  })();

  useEffect(() => {
    if (!storedAccessToken) {
      console.error("Access token is null");
      setError("Access token is not available");
      setLoading(false);
      return;
    }

    const fetchCurrentlyPlaying = async () => {
      setLoading(true);
      try {
        const data = await fetchApi(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: { Authorization: `Bearer ${storedAccessToken}` },
          }
        );
        setCurrentlyPlaying(data);
        setSongPosition(data.progress_ms);
        setIsPlaying(data.is_playing);
      } catch (error) {
        console.error("Error fetching currently playing track:", error);
        setError("No song currently playing");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyPlaying();
    // Removed currentlyPlaying from the dependency array to avoid excessive polling
  }, [fetchApi, storedAccessToken]);

  const updateSongPosition = useCallback(async () => {
    if (!storedAccessToken) {
      return; // Early return if no access token
    }
    useEffect(() => {
      if (!storedAccessToken || !isPlaying) {
        return; // Do not set up polling if there is no access token or if not playing
      }

      // Start polling for song position
      intervalIdRef.current = setInterval(() => {
        updateSongPosition();
      }, pollInterval);

      // Cleanup function to clear the interval
      return () => clearInterval(intervalIdRef.current);
    }, [isPlaying, storedAccessToken, updateSongPosition]);

    try {
      const data = await fetchApi(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        }
      );
      setSongPosition(data.progress_ms);
    } catch (error) {
      console.error("Error fetching currently playing track:", error);
      setError("Failed to update song position");
    }
  }, [fetchApi, storedAccessToken]);

  // Refactor control handlers using useCallback
  const handleNextPrevious = useCallback(
    async (direction) => {
      if (!storedAccessToken) return;
      try {
        await fetchApi(`https://api.spotify.com/v1/me/player/${direction}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });
      } catch (error) {
        console.error(`Error with ${direction} track:`, error);
      }
    },
    [fetchApi, storedAccessToken]
  );

  const togglePlayPause = useCallback(async () => {
    const endpoint = isPlaying ? "pause" : "play";
    try {
      await fetchApi(`https://api.spotify.com/v1/me/player/${endpoint}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${storedAccessToken}` },
      });
      setIsPlaying(!isPlaying); // Toggle the state
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  }, [fetchApi, isPlaying, storedAccessToken]);

  const handleSliderChange = useCallback(
    async (newValue) => {
      try {
        await fetchApi(
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
    },
    [fetchApi, storedAccessToken]
  );

  if (loading) return <Spinner size="lg" color="warning" />;
  if (error) return <p>Error: {error}</p>;
  if (!currentlyPlaying || !currentlyPlaying.item)
    return <p>No currently playing track.</p>;

  // Handlers for next and previous
  const handlePrevious = () => handleNextPrevious("previous");
  const handleNext = () => handleNextPrevious("next");

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000); // Use Math.floor to always round down
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="">
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50  "
        shadow="sm"
      >
        <CardBody className="">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center ">
            <div className=" col-span-6 md:col-span-4 flex justify-center">
              <Image
                alt="Album cover"
                // className="object-cover"
                // height={200}
                shadow="md"
                className="mx-auto"
                src={currentlyPlaying.item.album.images[0].url} // Dynamically set the album cover
                // width="100%"
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
                  <p className="text-small">{songPosition}</p>
                  <p className="text-small text-foreground/50">
                    {/* {(currentlyPlaying.item.duration_ms)} */}
                    {formatTime(currentlyPlaying.item.duration_ms)}
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
    </div>
  );
}
