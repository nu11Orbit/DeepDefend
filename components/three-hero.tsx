"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import type { JSX } from "react/jsx-runtime" 

function DuckModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/assets/3d/duck.glb")
  return <primitive object={scene} {...props} />
}

export function ThreeHero() {
  return (
    <div className="w-full h-[60vh] rounded-b-xl border-b bg-background">
      <Canvas camera={{ position: [2, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <DuckModel position={[0, -0.5, 0]} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
      </Canvas>
    </div>
  )
}

useGLTF.preload("/assets/3d/duck.glb")
