import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CustomMaterial } from "./CustomMaterial";
import * as THREE from "three";
import { easing } from "maath";
import { TextureLoader } from "three";

function ShaderPlane() {
  const ref = useRef({
    time: 0,
    resolution: new THREE.Vector3(),
    pointer: new THREE.Vector3(),
  });
  const { viewport, size } = useThree();

  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "/building.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    }),
  );

  const videoTexture = new THREE.VideoTexture(video);

  useEffect(() => void video.play(), [video]);

  useFrame((state, delta) => {
    ref.current.time += delta;
    easing.damp3(
      ref.current.pointer,
      [state.pointer.width, state.pointer.height, 0],
      0.2,
      delta,
    );
  });

  const texture = useLoader(TextureLoader, "/building.jpg");
  const mask = useLoader(TextureLoader, "./building-depth.png");

  console.log(texture);
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <customMaterial
        ref={ref}
        mask={mask}
        source={texture}
        videoTexture={videoTexture}
        key={CustomMaterial.key}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ShaderPlane />
    </Canvas>
  );
}
