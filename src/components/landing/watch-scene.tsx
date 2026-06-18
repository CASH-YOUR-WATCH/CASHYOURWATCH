"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/models/watch.glb";

function WatchModel() {
  const { scene } = useGLTF(MODEL);
  // Clonamos para no mutar la escena cacheada por useGLTF.
  const model = useMemo(() => scene.clone(true), [scene]);
  const ref = useRef<THREE.Group>(null);

  // Centra y autoescala el modelo (la escala original de Meshy es desconocida).
  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    model.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = 2.6 / maxDim;
    if (ref.current) ref.current.scale.setScalar(target);
  }, [model]);

  // Gira lento + flota + reacciona al scroll y al cursor.
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    g.rotation.y = t * 0.3 + scrollY * 0.0025 + state.pointer.x * 0.3;
    g.rotation.x = Math.sin(t * 0.5) * 0.05 + state.pointer.y * 0.12;
    g.position.y = Math.sin(t * 0.7) * 0.08;
  });

  return (
    <group ref={ref}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL);

export default function WatchScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={1.3} />
      <directionalLight position={[-5, -2, -4]} intensity={0.4} />
      <Suspense fallback={null}>
        <WatchModel />
        {/* Iluminación de entorno de estudio (reflejos en metal/cristal). */}
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}
