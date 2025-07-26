'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, BakeShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'

const OptimizedScene = () => {
  useEffect(() => {
    return () => {
      // Cleanup von Three.js Ressourcen beim Unmounting
      THREE.Cache.clear()
    }
  }, [])

  return (
    <Canvas
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      {/* Performance Optimierungen */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <BakeShadows />
      
      {/* Hier kommt der eigentliche Szeneninhalt */}
    </Canvas>
  )
}

export default OptimizedScene
