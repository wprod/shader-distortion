import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CustomMaterial } from "./CustomMaterial";
import * as THREE from "three";
import { easing } from "maath";
import { TextureLoader } from "three";

interface ShaderPlaneProps {
  textureName: string;
}

function ShaderPlane({ textureName }: ShaderPlaneProps) {
  const ref = useRef({
    time: 0,
    resolution: new THREE.Vector3(),
    pointer: new THREE.Vector3(),
  });
  const { viewport, size } = useThree();

  const [video, setVideo] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: `/${textureName}.mp4`,
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    }),
  );

  const videoTexture = new THREE.VideoTexture(video);

  useEffect(() => void video.play(), [video]);

  useEffect(() => {
    setVideo(
      Object.assign(document.createElement("video"), {
        src: `/${textureName}.mp4`,
        crossOrigin: "Anonymous",
        loop: true,
        muted: true,
      }),
    );
  }, [textureName]);

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
  // const mask = useLoader(TextureLoader, `./${textureName}-depth.png`);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <customMaterial
        ref={ref}
        source={texture}
        videoTexture={videoTexture}
        key={CustomMaterial.key}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
      />
    </mesh>
  );
}

export default function App() {
  const [textureName, setTextureName] = useState<"mont" | "building" | "house">(
    "house",
  );

  return (
    <>
      <Canvas>
        <ShaderPlane textureName={textureName} />
      </Canvas>
    </>
  );
}
