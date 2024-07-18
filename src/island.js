import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SandImage from "./textures/sand.jpg";
import RockImage from "./textures/seaside_rock_diff_1k.jpg";
import GrassImage from "./textures/aerial_grass_rock_diff_1k.jpg";
import PalmTreeModel from "./models/palmtree/XL-Wooden Flower pot.glb";

const Island = ({ position, size }) => {
  const sandTexture = useLoader(TextureLoader, SandImage);
  const rockTexture = useLoader(TextureLoader, RockImage);
  const grassTexture = useLoader(TextureLoader, GrassImage);
  const palmTree = useLoader(GLTFLoader, PalmTreeModel);

  return (
    <group position={position}>
      {/* Island Base */}
      <mesh position={[0, -size / 2, 0]}>
        <sphereGeometry args={[size, 128, 128]} />
        <meshStandardMaterial
          map={sandTexture}
          displacementMap={sandTexture}
          displacementScale={10}
        />
      </mesh>

      {/* Rocks */}
      <mesh position={[-size / 4, -size / 2.5, size / 4]}>
        <sphereGeometry args={[size / 6, 64, 64]} />
        <meshStandardMaterial
          map={rockTexture}
          displacementMap={rockTexture}
          displacementScale={5}
        />
      </mesh>
      <mesh position={[size / 4, -size / 2.5, -size / 4]}>
        <sphereGeometry args={[size / 8, 64, 64]} />
        <meshStandardMaterial
          map={rockTexture}
          displacementMap={rockTexture}
          displacementScale={5}
        />
      </mesh>

      {/* Vegetation */}
      <mesh position={[0, -size / 2.5, 0]}>
        <sphereGeometry args={[size / 1.5, 64, 64]} />
        <meshStandardMaterial
          map={grassTexture}
          displacementMap={grassTexture}
          displacementScale={3}
        />
      </mesh>

      {/* Palm Trees */}
      <primitive
        object={palmTree.scene}
        position={[0, -size / 2.5, size / 3]}
        scale={size / 10}
      />
      <primitive
        object={palmTree.scene}
        position={[size / 5, -size / 2.5, -size / 4]}
        scale={size / 12}
      />
    </group>
  );
};

export default Island;
