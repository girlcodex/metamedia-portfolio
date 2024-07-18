// src/Water.js
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { Water } from "three-stdlib";

const WaterEffect = () => {
  const waterNormals = useLoader(
    THREE.TextureLoader,
    "https://threejs.org/examples/textures/waternormals.jpg",
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const waterGeometry = useMemo(
    () => new THREE.PlaneGeometry(10000, 10000),
    [],
  );
  const water = useMemo(
    () =>
      new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: false,
      }),
    [waterGeometry, waterNormals],
  );

  useFrame(() => {
    water.material.uniforms.time.value += 1.0 / 60.0;
  });

  return <primitive object={water} rotation-x={-Math.PI / 2} />;
};

export default WaterEffect;
