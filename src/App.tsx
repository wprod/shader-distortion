import { useRef } from 'react'
import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'
import { CustomMaterial } from './CustomMaterial'
import * as THREE from "three";
import {easing} from "maath";
import {TextureLoader} from "three";

function ShaderPlane() {
    const ref = useRef({
        time: 0,
        resolution: new THREE.Vector3(),
        pointer: new THREE.Vector3()
    })
    const { viewport, size } = useThree()

    useFrame((state, delta) => {
        ref.current.time += delta
        easing.damp3(ref.current.pointer, [state.pointer.width, state.pointer.height, 0], 0.2, delta)
    })

    const texture = useLoader(TextureLoader, "/building.jpg");
    const mask = useLoader(TextureLoader, "./building-depth.png");

    console.log(texture);
    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry />
            <customMaterial ref={ref} mask={mask} source={texture} key={CustomMaterial.key} resolution={[size.width * viewport.dpr, size.height * viewport.dpr]} />
        </mesh>
    )
}

export default function App() {
    return (
        <Canvas>
            <ShaderPlane />
        </Canvas>
    )
}
