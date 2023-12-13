import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Slider } from "@nextui-org/react";
import { VolumeHighIcon } from "./VolumeHighIcon";
import { VolumeLowIcon } from "./VolumeLowIcon";

export default function CurrentlyPlayingCard() {
  const theme = useTheme();

  return (
    <Card sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "column", flex: "1 0 auto" }}>
        <CardContent>
          <Typography component="div" variant="h5">
            Pink Friday Girls
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            Nicki Minaj
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === "rtl" ? (
              <SkipNextIcon />
            ) : (
              <SkipPreviousIcon />
            )}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === "rtl" ? (
              <SkipPreviousIcon />
            ) : (
              <SkipNextIcon />
            )}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="https://i.scdn.co/image/ab67616d0000b273651e1dbc0b5218f2306181a1"
        alt="Live from space album cover"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Slider
          size="lg"
          step={0.01}
          maxValue={1}
          minValue={0}
          color="success"
          endContent={<VolumeLowIcon className="text-2xl" />}
          startContent={<VolumeHighIcon className="text-2xl" />}
          orientation="vertical"
          aria-label="Temperature"
          defaultValue={0.6}
          style={{ height: "200px" }}
        />
      </Box>
    </Card>
  );
}
