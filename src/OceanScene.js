import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Popover,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Island from "./island.js";
import InteractiveCard from "./InteractiveCard";
import WaterEffect from "./water";
import FloatingMenu from "./FloatingMenu";
import TagCanvasComponent from "./TagCanvasSphere";
import skyboxImage from "./textures/sunset.jpg";

function Skybox() {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(skyboxImage, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
  }, [scene]);

  return null;
}

function HelpPopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ position: "absolute", top: "92vh", right: "0vw", zIndex: 10 }}
      >
        Help
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6" gutterBottom>
            How to Navigate
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Rotate:</strong> Use your mouse to rotate the camera.
          </Typography>
          <br />
          <Typography variant="body1" gutterBottom>
            <strong>Zoom:</strong> Scroll to zoom in and out (limited to skybox
            bounds).
          </Typography>
          <br />
          <Typography variant="body1">
            <strong>Pan:</strong> Drag with the right mouse button to pan.
          </Typography>
        </Paper>
      </Popover>
    </div>
  );
}

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          3D Ocean Scene
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          style={{ marginRight: 16, backgroundColor: "white" }}
        />
        <Tooltip title="Notifications">
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Account">
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        padding: 10,
        backgroundColor: "#333",
        color: "#fff"
      }}
    >
      <Typography variant="body2">
        &copy; 2024 rpwalsh.com; All rights reserved.
      </Typography>
    </div>
  );
}

function InfoPanel() {
  return (
    <Paper
      style={{
        padding: 20,
        position: "absolute",
        bottom: 60,
        right: 20,
        zIndex: 10,
      }}
    >
      <Typography variant="h6">Scene Information</Typography>
      <Typography variant="body2">
        This is a 3D interactive ocean scene.
      </Typography>
    </Paper>
  );
}

function SettingsPanel() {
  return (
    <Paper
      style={{
        padding: 20,
        position: "absolute",
        bottom: 60,
        left: 20,
        zIndex: 10,
      }}
    >
      <Typography variant="h6">Settings</Typography>
      <Typography variant="body2">Adjust scene settings here.</Typography>
    </Paper>
  );
}

function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button
        onClick={toggleDrawer}
        style={{
          color: "Black",
          position: "absolute",
          top: 20,
          left: 80,
          zIndex: 10,
        }}
      >
        Toggle Sidebar
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List>
          {["Item 1", "Item 2", "Item 3"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);

  const handleNotificationOpen = () => {
    setOpen(true);
  };

  const handleNotificationClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleNotificationClose}
        message="This is a notification."
        autoHideDuration={3000}
      />
      <Button
        onClick={handleNotificationOpen}
        style={{
          color: "black",
          position: "absolute",
          top: 20,
          left: 225,
          zIndex: 10,
        }}
      >
        Show Notification
      </Button>
    </div>
  );
}

function ProgressBar() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}
    >
      <CircularProgress variant="determinate" value={75} />
    </div>
  );
}

function OceanScene() {
  const waterRef = useRef(null);
  const [tagCanvasActive, setTagCanvasActive] = useState(false);

  return (
    <Container
      maxWidth="false"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Header />
      {/* TagCanvas Component*/}
      <Grid container style={{ height: "100%", width: "100%" }}>
        {/* 3D Canvas */}
        <Grid item xs={12} md={12} style={{ position: "relative" }}>
          <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 100, 500], near: 100, far: 5000 }}
            onCreated={({ camera }) => {
              camera.position.set(0, 100, 100); // Initial camera position
              camera.lookAt(0, 0, 0); // Point camera towards the scene center
              camera.updateProjectionMatrix(); // Ensure changes take effect
            }}
          >
            {/* Skybox */}
            <Skybox />
            <TagCanvasComponent setTagCanvasActive={setTagCanvasActive} />

            {/* Water effect */}
            <WaterEffect />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[100, 100, 100]} intensity={0.8} />
            <spotLight
              intensity={0.5}
              position={[100, 100, 100]}
              angle={0.2}
              penumbra={1}
            />

            {/* Water surface */}
            <mesh
              ref={waterRef}
              position={[0, -100, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[10000, 10000]} />
              <meshStandardMaterial color="lightblue" />
            </mesh>

            {/* Orbit controls with constraints */}
            <OrbitControls
              enabled={!tagCanvasActive} // Disable OrbitControls when TagCanvas is active
              enableZoom={true}
              enablePan={true}
              maxDistance={400} // Maximum distance from the origin (skybox)
              minDistance={100} // Minimum distance to the origin
              minPolarAngle={Math.PI / 8} // Limit panning below the horizon
              maxPolarAngle={Math.PI / 2.1} // Limit looking above the horizon
            />
          </Canvas>
        </Grid>

        {/* Floating Menu */}
        <FloatingMenu />
        <Island />
        {/* Interactive Card */}
        <Container
          style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
        >
          <InteractiveCard />
        </Container>

        {/* Help Popover */}
        <Container
          style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
        >
          <HelpPopover />
        </Container>

        {/* Additional UI Elements */}
        <InfoPanel />
        <SettingsPanel />
        <Sidebar />
        <Notifications />
        {/*<ProgressBar />*/}
      </Grid>

      <Footer />
    </Container>
  );
}

export default OceanScene;
