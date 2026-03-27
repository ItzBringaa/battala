import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1, 64, 64]} scale={1.5}>
          <MeshDistortMaterial
            color="#FF6B00"
            speed={3}
            distort={0.4}
            radius={1}
          />
        </Sphere>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={2} position={[2, 1, -1]}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#0055FF" />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={1.5} floatIntensity={1.5} position={[-2, -1, 0]}>
        <mesh>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
      </Float>
    </>
  );
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
