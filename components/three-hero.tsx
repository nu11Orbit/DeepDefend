"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"
import type { JSX } from "react/jsx-runtime"

function AnimatedTorus(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.4
    ref.current.rotation.x += delta * 0.15
  })
  return (
    <mesh ref={ref} {...props}>
      <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
      <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.2} />
    </mesh>
  )
}

export function ThreeHero() {
  return (
    <div className="w-full h-[60vh] rounded-b-xl border-b bg-background">
      <Canvas camera={{ position: [2, 1.5, 3], fov: 30 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <AnimatedTorus position={[0, 0, 0]} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
      </Canvas>
    </div>
  )
}
