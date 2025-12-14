/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing JSX.IntrinsicElements types in some environments
// We augment both global JSX and React.JSX to cover different TS configurations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
    }
  }
}

const QuantumParticle = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.2;
      ref.current.rotation.x = t * 0.5;
      ref.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 32, 32]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.5}
        distort={0.4}
        speed={2}
      />
    </Sphere>
  );
};

const MacroscopicWave = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.x = Math.sin(t * 0.2) * 0.2;
       ref.current.rotation.y = t * 0.1;
    }
  });

  return (
    <Torus ref={ref} args={[3, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} transparent opacity={0.4} wireframe />
    </Torus>
  );
}

export const HeroScene: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          {/* Main Hero Particle */}
          <QuantumParticle position={[0, 0, 0]} color={themeColor} scale={1.2} />
          <MacroscopicWave color={themeColor} />
        </Float>
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
           {/* Secondary Accent Particles - darker/lighter variants */}
           <QuantumParticle position={[-3, 1, -2]} color="#333" scale={0.5} />
           <QuantumParticle position={[3, -1, -3]} color={themeColor} scale={0.6} />
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

// Simplified Abstract Scene for "Impact" section that works across all papers
export const AbstractImpactScene: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} color={themeColor} />
        <Environment preset="studio" />
        
        <Float rotationIntensity={0.6} floatIntensity={0.4} speed={0.5}>
            <group>
                <Torus args={[1.5, 0.4, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                     <meshStandardMaterial color={themeColor} metalness={0.8} roughness={0.2} />
                </Torus>
                 <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
                </Sphere>
            </group>
        </Float>
      </Canvas>
    </div>
  );
}