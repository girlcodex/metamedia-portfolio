import React, { useRef } from "react";
import { Box } from "@mui/material";

const InteractiveCard = () => {
  const cardRef = useRef();

  return (
    <Box
      ref={cardRef}
      className="card"
      style={{
        position: "absolute",
        top: "7.5vh",
        left: "20px",
        width: "400px",
        height: "200px",
        zIndex: "10",
      }}
    >
      <p>Hello World</p>
    </Box>
  );
};

export default InteractiveCard;
