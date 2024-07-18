import React from "react";
import { Html } from "@react-three/drei";
import { Button } from "@mui/material";

const FloatingMenu = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10vh",
        right: "5vh",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        align: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 66, 0.5)",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        style={{ width: "100%", margin: 5, color: "black" }}
      >
        Industrial Design
      </Button>
      <Button
        variant="contained"
        color="secondary"
        style={{ width: "100%", margin: 5, color: "black" }}
      >
        Site Templates
      </Button>
      <Button
        variant="contained"
        color="warning"
        style={{ width: "100%", margin: 5, color: "black" }}
      >
        Architecture
      </Button>
      <Button
        variant="contained"
        color="success"
        style={{ width: "100%", margin: 5, color: "black" }}
      >
        User Interface
      </Button>
      <Button
        variant="contained"
        color="error"
        style={{ width: "100%", margin: 5, color: "black" }}
      >
        Code Samples
      </Button>
      <Button
        variant="contained"
        color="info"
        style={{ width: "100%", margin: 5 }}
      >
        Contact Sarah
      </Button>
    </div>
  );
};

export default FloatingMenu;
