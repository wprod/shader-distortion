import * as THREE from "three";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      customMaterial: ReactThreeFiber.Object3DNode<
        // @ts-ignore
        CustomMaterial,
        typeof CustomMaterial
      >;
    }
  }
}

const CustomMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    pointer: new THREE.Vector2(),
    source: new THREE.Texture(),
    mask: new THREE.Texture(),
    videoTexture: null,
  },
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
  /*glsl*/ `
    varying vec2 vUv;
    uniform sampler2D source;
    uniform sampler2D mask;
    uniform vec2 pointer; 
    uniform sampler2D videoTexture;

    void main(){
      // Sample the color from the upper part of the texture
      vec4 color = texture2D(videoTexture, vec2(vUv.x, vUv.y * 0.5 + 0.5));
    
      // Sample the depth from the lower part of the texture
      vec4 depth = texture2D(videoTexture, vec2(vUv.x, vUv.y * 0.5));
    
      // Use the depth to calculate an offset for the color sampling
      vec2 offset = depth.r * 2. * (pointer * 0.025);
    
      // Sample the color again with the offset
      vec4 offsetColor = texture2D(videoTexture, vec2(vUv.x, vUv.y * 0.5 + 0.5) + offset);
    
      // Use the offset color as the output color
      gl_FragColor = offsetColor;
}
  `,
);

extend({ CustomMaterial });

export { CustomMaterial };
