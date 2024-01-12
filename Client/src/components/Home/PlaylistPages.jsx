import React from "react";
import { Pagination } from "@nextui-org/react";

const PlaylistPages = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination
      loop
      showControls
      color="success"
      total={totalPages}
      initialPage={currentPage}
      onChange={onPageChange}
    />
  );
};

export default PlaylistPages;
