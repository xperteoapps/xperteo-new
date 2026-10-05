"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Obraz na planie R3F z „liquid” distortion na hover (DESIGN.md §4 S5, jesperlandberg):
 * przesunięcie UV od kursora + fala + lekka aberracja, siła 0→0.3 z easingiem.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uStrength;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    float pr = uPlane.x / uPlane.y;
    float ir = uImage.x / uImage.y;
    vec2 s = vec2(1.0);
    if (pr > ir) s.y = ir / pr; else s.x = pr / ir;
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = cover(vUv);
    float d = distance(vUv, uMouse);
    float fall = smoothstep(0.7, 0.0, d);
    vec2 dir = normalize(vUv - uMouse + vec2(1e-4));
    float wave = sin(d * 22.0 - uTime * 4.0) * 0.5 + 0.5;
    vec2 off = dir * wave * fall * uStrength * 0.12;
    float r = texture2D(uTex, uv + off * 1.0).r;
    float g = texture2D(uTex, uv + off * 0.8).g;
    float b = texture2D(uTex, uv + off * 0.6).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function Plane({ src, width, height, hover }: { src: string; width: number; height: number; hover: React.RefObject<{ on: boolean; x: number; y: number }> }) {
  const tex = useTexture(src);
  const { viewport, invalidate } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uStrength: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uImage: { value: new THREE.Vector2(width, height) },
    }),
    [tex, width, height],
  );

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame((state, dt) => {
    const u = uniforms;
    const h = hover.current;
    const target = h?.on ? 0.3 : 0;
    u.uStrength.value += (target - u.uStrength.value) * Math.min(dt * 6, 1);
    u.uTime.value += dt;
    if (h) {
      u.uMouse.value.x += (h.x - u.uMouse.value.x) * Math.min(dt * 8, 1);
      u.uMouse.value.y += (h.y - u.uMouse.value.y) * Math.min(dt * 8, 1);
    }
    u.uPlane.value.set(viewport.width, viewport.height);
    if (u.uStrength.value > 0.002 || h?.on) invalidate();
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export function LiquidImage({ src, width, height, className = "" }: { src: string; width: number; height: number; className?: string }) {
  const hover = useRef({ on: false, x: 0.5, y: 0.5 });
  const box = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    hover.current.x = (e.clientX - r.left) / r.width;
    hover.current.y = 1 - (e.clientY - r.top) / r.height;
  };

  return (
    <div
      ref={box}
      className={className}
      onPointerEnter={() => (hover.current.on = true)}
      onPointerLeave={() => (hover.current.on = false)}
      onPointerMove={onMove}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        className="!pointer-events-none"
      >
        <Plane src={src} width={width} height={height} hover={hover} />
      </Canvas>
    </div>
  );
}
