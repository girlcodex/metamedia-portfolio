import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const createHexagonGeometry = () => {
  const sides = 6;
  const radius = 40; // Adjust size as needed
  const depth = 5; // Adjust depth as needed

  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const indices = [];
  const uvs = [];

  // Create vertices and UVs for front and back faces
  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * Math.PI * 2;
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);

    // Front face
    vertices.push(x, y, 0); // Vertex on the edge for front face
    uvs.push((x / radius + 1) / 2, (y / radius + 1) / 2); // UV for front face

    // Back face
    vertices.push(x, y, depth); // Vertex on the edge for back face
    uvs.push((x / radius + 1) / 2, (y / radius + 1) / 2); // UV for back face
  }

  // Center vertices for front and back faces
  vertices.push(0, 0, 0); // Center vertex for front face
  uvs.push(0.5, 0.5);
  vertices.push(0, 0, depth); // Center vertex for back face
  uvs.push(0.5, 0.5);

  // Create indices for front and back faces
  for (let i = 0; i < sides; i++) {
    const frontIndex1 = i * 2;
    const frontIndex2 = (i * 2 + 2) % (sides * 2);
    const backIndex1 = i * 2 + 1;
    const backIndex2 = (i * 2 + 3) % (sides * 2);

    const frontCenterIndex = sides * 2;
    const backCenterIndex = sides * 2 + 1;

    // Front face indices
    indices.push(frontCenterIndex, frontIndex1, frontIndex2);

    // Back face indices (reverse winding order for back face)
    indices.push(backCenterIndex, backIndex2, backIndex1);
  }

  // Create indices for the sides
  for (let i = 0; i < sides; i++) {
    const current = i * 2;
    const next = (i * 2 + 2) % (sides * 2);

    indices.push(current, next, next + 1); // First triangle
    indices.push(current, next + 1, current + 1); // Second triangle
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
};

const TagCanvasComponent = ({ setTagCanvasActive }) => {
  const groupRef = useRef();
  const { gl, camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    const tags = [
      { href: "https://link1.com", imgSrc: require("../textures/wood.png") },
      { href: "https://link3.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link4.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link5.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link6.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link7.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link8.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link9.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link10.com", imgSrc: "https://via.placeholder.com/100.jpg" },
      { href: "https://link11.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link12.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link13.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link14.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link15.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link16.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link17.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link18.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link19.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link20.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link21.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link22.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link23.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link24.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link25.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link26.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link27.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link28.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link29.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link30.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link31.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link32.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link33.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link34.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link35.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link36.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link37.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link38.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link39.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link40.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link36.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link37.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link38.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link39.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link40.com", imgSrc: "https://via.placeholder.com/100" },
          { href: "https://link36.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link37.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link38.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link39.com", imgSrc: "https://via.placeholder.com/100" },
      { href: "https://link40.com", imgSrc: "https://via.placeholder.com/100" },
    ];
    const radius = 300;
    const count = tags.length;
    const phiStep = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    tags.forEach((tag, i) => {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y) * radius; // radius at y

      const theta = phiStep * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Load front and back textures
      const frontTexture = textureLoader.load(tag.imgSrc);
      const backTexture = textureLoader.load(tag.imgSrc);

      const frontMaterial = new THREE.MeshBasicMaterial({
        map: frontTexture,
        side: THREE.FrontSide,
      });

      const backMaterial = new THREE.MeshBasicMaterial({
        map: backTexture,
        side: THREE.BackSide,
      });

      const geometry = createHexagonGeometry();
      const frontMesh = new THREE.Mesh(geometry, frontMaterial);
      const backMesh = new THREE.Mesh(geometry, backMaterial);

      const hexGroup = new THREE.Group();
      hexGroup.add(frontMesh);
      hexGroup.add(backMesh);

      hexGroup.position.set(x, y * radius, z);
      hexGroup.lookAt(0, 0, 0);

      hexGroup.userData.href = tag.href;
      groupRef.current.add(hexGroup);
    });
  }, [gl]);

  const handleMouseDown = (event) => {
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.current.setFromCamera(mouse.current, camera);

    const intersects = raycaster.current.intersectObjects(groupRef.current.children);

    if (intersects.length > 0) {
      setIsDragging(true);
      setTagCanvasActive(true);
      setPreviousMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    const rotationSpeed = 0.005;

    groupRef.current.rotation.y += deltaX * rotationSpeed;
    groupRef.current.rotation.x += deltaY * rotationSpeed;

    setPreviousMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTagCanvasActive(false);
  };

  useEffect(() => {
    const handleMouseDownWrapper = (event) => {
      event.stopPropagation();
      handleMouseDown(event);
    };

    const handleMouseMoveWrapper = (event) => {
      event.stopPropagation();
      handleMouseMove(event);
    };

    const handleMouseUpWrapper = (event) => {
      event.stopPropagation();
      handleMouseUp(event);
    };

    gl.domElement.addEventListener("mousedown", handleMouseDownWrapper);
    gl.domElement.addEventListener("mousemove", handleMouseMoveWrapper);
    gl.domElement.addEventListener("mouseup", handleMouseUpWrapper);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDownWrapper);
      gl.domElement.removeEventListener("mousemove", handleMouseMoveWrapper);
      gl.domElement.removeEventListener("mouseup", handleMouseUpWrapper);
    };
  }, [isDragging, previousMousePosition]);

  useFrame(() => {
    if (!isDragging) {
      groupRef.current.rotation.y += 0.001; // Rotate continuously if not dragging
    }
  });

  return <group ref={groupRef} />;
};

export default TagCanvasComponent;