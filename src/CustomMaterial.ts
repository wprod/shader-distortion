import * as THREE from 'three'
import {extend, ReactThreeFiber} from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            customMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>
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
    uniform vec2 pointer; // Add this line

    void main(){
      // Get the color of the pixel at the current position in the heightmap
      vec4 heightColor = texture2D(mask, vUv);

      // Calculate the offset based on the color values from the heightmap
      vec2 offset = heightColor.rg * (pointer * 0.05);

      // Get the color of the pixel at the offset position in the texture
      vec4 color = texture2D(source, vUv + offset);

      gl_FragColor = color;
    }
  `
)

extend({ CustomMaterial })

export { CustomMaterial }
