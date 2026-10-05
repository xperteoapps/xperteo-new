"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroScroll } from "./hero-scroll";

const MODEL = "/models/x.glb";
const DRACO = "/draco/";
const TILT = THREE.MathUtils.degToRad(15);

/**
 * Znak Xperteo (GLB z Higgsfield): matowa bryła + żółte krawędzie emisyjne.
 * Obrót za kursorem (lerp 0.05), scroll 0→100vh: +90° i scale 1→0.6.
 */
function Mark() {
  const { scene } = useGLTF(MODEL, DRACO);
  const outer = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const prev = mesh.material as THREE.MeshBasicMaterial;
      mesh.material = new THREE.MeshStandardMaterial({
        map: prev.map ?? null,
        color: prev.map ? 0xffffff : 0x0a0a0a,
        roughness: 0.95,
        metalness: 0,
      });
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry, 28),
        new THREE.LineBasicMaterial({ color: 0xffd500, transparent: true, opacity: 0.9 }),
      );
      mesh.add(edges);
    });
    // wyśrodkuj i znormalizuj rozmiar
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    const s = 1.6 / Math.max(size.x, size.y, size.z);
    root.scale.setScalar(s);
    return root;
  }, [scene]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const g = outer.current;
    if (!g) return;
    const p = heroScroll.p;
    const targetX = mouse.current.y * TILT;
    const targetY = mouse.current.x * TILT + p * (Math.PI / 2);
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
    g.rotation.y += (targetY - g.rotation.y) * 0.05;
    const targetScale = 1 - 0.4 * p;
    const s = THREE.MathUtils.lerp(g.scale.x, targetScale, 0.1);
    g.scale.setScalar(s);
    g.position.x = THREE.MathUtils.lerp(g.position.x, 0.9 + p * 0.6, 0.08);
  });

  return (
    <group ref={outer} position={[0.9, 0, 0]}>
      {/* dysk leży płasko w GLB — stawiamy go twarzą do kamery */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL, DRACO);

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 32, position: [0, 0, 4.2], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      className="!pointer-events-none"
      aria-hidden="true"
    >
      <hemisphereLight args={[0xffffff, 0x151515, 1.1]} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.2} />
      <directionalLight position={[-3, -1, 2]} intensity={0.6} color={0xffd500} />
      <Suspense fallback={null}>
        <Mark />
      </Suspense>
    </Canvas>
  );
}
