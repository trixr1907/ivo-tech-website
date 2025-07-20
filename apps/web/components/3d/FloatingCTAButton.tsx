'use client';

import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';

interface FloatingCTAButtonProps {
  text: string;
  position?: [number, number, number];
  onClick?: () => void;
}

export function FloatingCTAButton({ text, position = [0, -2, 0], onClick }: FloatingCTAButtonProps) {
  const buttonRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (buttonRef.current) {
      // Floating animation
      buttonRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Hover tilt effect
      if (hovered) {
        buttonRef.current.rotation.x = THREE.MathUtils.lerp(buttonRef.current.rotation.x, -0.1, delta * 5);
        buttonRef.current.rotation.z = THREE.MathUtils.lerp(buttonRef.current.rotation.z, 0.05, delta * 5);
        buttonRef.current.scale.setScalar(THREE.MathUtils.lerp(buttonRef.current.scale.x, 1.1, delta * 5));
      } else {
        buttonRef.current.rotation.x = THREE.MathUtils.lerp(buttonRef.current.rotation.x, 0, delta * 5);
        buttonRef.current.rotation.z = THREE.MathUtils.lerp(buttonRef.current.rotation.z, 0, delta * 5);
        buttonRef.current.scale.setScalar(THREE.MathUtils.lerp(buttonRef.current.scale.x, 1, delta * 5));
      }

      // Click animation
      if (clicked) {
        buttonRef.current.scale.setScalar(0.95);
        setClicked(false);
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    if (onClick) onClick();
  };

  return (
    <group
      ref={buttonRef}
      position={[position[0], position[1], position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Button Background */}
      <RoundedBox args={[3, 0.8, 0.2]} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color={hovered ? 0x4060ff : 0x3050ee}
          emissive={0x001155}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Button Glow Effect */}
      <RoundedBox args={[3.2, 1, 0.4]} radius={0.1} smoothness={4}>
        <meshBasicMaterial color={0x4060ff} transparent opacity={hovered ? 0.2 : 0.1} />
      </RoundedBox>

      {/* Button Text */}
      <Text position={[0, 0, 0.15]} fontSize={0.3} color='white' anchorX='center' anchorY='middle' fontWeight='bold'>
        {text}
      </Text>

      {/* Particle Effects */}
      {hovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1.5, 0.3]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color={0x4060ff} transparent opacity={0.8} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
