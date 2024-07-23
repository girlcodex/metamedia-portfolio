import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import WaterEffect from "./water";

const WaterScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let container, camera, scene, renderer, controls, water, mirrorMesh;
    const parameters = {
      width: 2000,
      height: 2000,
      widthSegments: 250,
      heightSegments: 250,
      depth: 1500,
      param: 4,
      filterparam: 1,
    };

    function init() {
      container = containerRef.current;
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.5,
        3000000,
      );
      camera.position.set(2000, 750, 2000);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.minDistance = 1000.0;
      controls.maxDistance = 5000.0;
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 500, 0);

      scene.add(new THREE.AmbientLight(0x444444));
      const light = new THREE.DirectionalLight(0xffffbb, 1);
      light.position.set(-1, 1, -1);
      scene.add(light);

      const waterNormals = new THREE.TextureLoader().load(
        "waternormals.jpg",
        () => {
          waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

          water = new WaterEffect(renderer, camera, scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 1.0,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffff55,
            waterColor: 0x001e0f,
            distortionScale: 50.0,
          });

          mirrorMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
              parameters.width * 500,
              parameters.height * 500,
            ),
            water.material,
          );
          mirrorMesh.add(water);
          mirrorMesh.rotation.x = -Math.PI * 0.5;
          scene.add(mirrorMesh);

          // Start rendering after water is initialized
          animate();
        },
        undefined,
        (err) => {
          console.error("Error loading water normals texture:", err);
        },
      );

      const cubeMap = new THREE.CubeTexture([]);
      cubeMap.format = THREE.RGBFormat;
      const loader = new THREE.ImageLoader();
      loader.load("./3.png", function (image) {
        const getSide = function (x, y) {
          const size = 1024;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const context = canvas.getContext("2d");
          context.drawImage(image, -x * size, -y * size);
          return canvas;
        };
        cubeMap.images[0] = getSide(2, 1); // px
        cubeMap.images[1] = getSide(0, 1); // nx
        cubeMap.images[2] = getSide(1, 0); // py
        cubeMap.images[3] = getSide(1, 2); // ny
        cubeMap.images[4] = getSide(1, 1); // pz
        cubeMap.images[5] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;
      });

      const cubeShader = THREE.ShaderLib["cube"];
      cubeShader.uniforms["tCube"].value = cubeMap;
      const skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide,
      });

      const skyBox = new THREE.Mesh(
        new THREE.BoxGeometry(1000000, 1000000, 1000000),
        skyBoxMaterial,
      );
      scene.add(skyBox);
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      const time = performance.now() * 0.001;
      water.material.uniforms["time"].value += 1.0 / 60.0;
      renderer.render(scene, camera);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default WaterScene;
