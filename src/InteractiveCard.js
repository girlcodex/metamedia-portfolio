import React, { useRef, useEffect } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";

const InteractiveCard = () => {
  const cardRef = useRef();

  // Update card rotation based on mouse movement

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
      {/* Your card content */}
      <p>Hello World</p>
    </Box>
  );
};

export default InteractiveCard;
