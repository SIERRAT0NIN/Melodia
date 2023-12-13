import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
// import {currentUserPlaylist} from "./CurrentUserPlaylist";

const currentUserPlaylist = "Test";

export default function Search() {
  return (
    <Autocomplete
      defaultItems={currentUserPlaylist}
      label="Current-user-playlist"
      placeholder="Playlist"
      className="max-w-xs"
    >
      {(playlist) => (
        <AutocompleteItem key={playlist.value}>
          {playlist.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
