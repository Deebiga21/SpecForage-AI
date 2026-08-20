import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCrystal() {
  const meshRef = useRef();
  const innerRingRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.4;
      innerRingRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Floating Crystal Geometry */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef} scale={2.2}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#6366f1"
            roughness={0.1}
            metalness={0.8}
            distort={0.25}
            speed={1.5}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Orbiting Wireframe Geometry Ring */}
      <mesh ref={innerRingRef} scale={3.4}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" wireframe opacity={0.6} transparent />
      </mesh>

      {/* Core Energy Glow Sphere */}
      <Sphere args={[0.9, 32, 32]}>
        <meshBasicMaterial color="#38bdf8" wireframe opacity={0.3} transparent />
      </Sphere>
    </group>
  );
}

export function HeroCrystalScene() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#818cf8" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#c084fc" />
        <pointLight position={[0, 0, 2]} intensity={2} color="#38bdf8" />
        
        <Stars radius={50} depth={50} count={1200} factor={4} saturation={0} fade speed={1.5} />
        <RotatingCrystal />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
