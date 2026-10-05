"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import polygonClipping from "polygon-clipping";
import { heroScroll } from "./hero-scroll";

export type HeroLayout = "desktop" | "mobile";

/** Długość pętli idle w sekundach — wszystkie ruchy są okresowe w PERIOD (seamless loop w wideo). */
export const HERO_LOOP_SECONDS = 8;
const TAU = Math.PI * 2;
const TILT = THREE.MathUtils.degToRad(14);
const SIGNAL = new THREE.Color(0xffd500);

/** Czas ręczny (render klatek do wideo). `null` = zegar R3F. */
const manualTime: { value: number | null } = { value: null };

declare global {
  interface Window {
    __heroSetTime?: (t: number) => void;
  }
}

/* ── Geometria X: unia dwóch kapsuł pod ±45° (proporcje z ikony logo: stroke 11/100, 31→69) ── */
function capsule(angle: number, halfLen: number, r: number, segs = 72): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const a = -Math.PI / 2 + (i / segs) * Math.PI;
    pts.push([halfLen + r * Math.cos(a), r * Math.sin(a)]);
  }
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI / 2 + (i / segs) * Math.PI;
    pts.push([-halfLen + r * Math.cos(a), r * Math.sin(a)]);
  }
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]);
}

function buildXGeometry(): THREE.ExtrudeGeometry {
  const halfLen = 0.83;
  const r = 0.17;
  const a = capsule(Math.PI / 4, halfLen, r);
  const b = capsule(-Math.PI / 4, halfLen, r);
  const union = polygonClipping.union([[a]], [[b]]);
  const ring = union[0][0];
  const shape = new THREE.Shape(ring.map(([x, y]) => new THREE.Vector2(x, y)));
  const depth = 0.3;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelOffset: 0,
    bevelSegments: 5,
    curveSegments: 1,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Matowa czerń + fresnel w żółci (świeci na fazach i bokach, nie na płaskim licu). */
function makeMarkMaterial(): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0b,
    roughness: 0.62,
    metalness: 0.05,
    clearcoat: 0.35,
    clearcoatRoughness: 0.5,
    sheen: 0.2,
    sheenColor: SIGNAL,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRim = { value: SIGNAL };
    shader.uniforms.uRimPow = { value: 5.0 };
    shader.uniforms.uRimStr = { value: 1.9 };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uRim;\nuniform float uRimPow;\nuniform float uRimStr;",
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        {
          vec3 vDir = normalize( vViewPosition );
          float fres = pow( 1.0 - saturate( dot( normalize( normal ), vDir ) ), uRimPow );
          totalEmissiveRadiance += uRim * fres * uRimStr;
        }`,
      );
  };
  return mat;
}

function makeHaloTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,213,0,0.55)");
  g.addColorStop(0.35, "rgba(255,213,0,0.18)");
  g.addColorStop(1, "rgba(255,213,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const LAYOUT = {
  desktop: { pos: [1.12, 0.0, 0] as const, scale: 0.94, baseY: 0.46, baseX: -0.08 },
  mobile: { pos: [0.06, 0.42, 0] as const, scale: 0.7, baseY: 0.36, baseX: -0.06 },
};

function Mark({ layout }: { layout: HeroLayout }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const geometry = useMemo(buildXGeometry, []);
  const material = useMemo(makeMarkMaterial, []);
  const L = LAYOUT[layout];

  useEffect(() => {
    if (layout !== "desktop") return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [layout]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state) => {
    const g = outer.current;
    const m = inner.current;
    if (!g || !m) return;
    const t = manualTime.value ?? state.clock.elapsedTime;
    const w = (TAU * t) / HERO_LOOP_SECONDS;
    const p = layout === "desktop" ? heroScroll.p : 0;
    const manual = manualTime.value !== null;
    const k = manual ? 1 : 0.06; // w renderze klatek — bez lerp (deterministycznie)

    // idle: powolne kołysanie + unoszenie, wszystko okresowe w PERIOD
    const idleY = Math.sin(w) * 0.26;
    const idleX = Math.sin(w + Math.PI / 2) * 0.09;
    const bob = Math.sin(2 * w) * 0.035;

    const targetY = L.baseY + idleY + mouse.current.x * TILT + p * (Math.PI / 2);
    const targetX = L.baseX + idleX + mouse.current.y * TILT * 0.7;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;

    const targetScale = L.scale * (1 - 0.4 * p);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, manual ? 1 : 0.1));
    g.position.x = THREE.MathUtils.lerp(g.position.x, L.pos[0] + p * 0.7, manual ? 1 : 0.08);
    g.position.y = L.pos[1] + bob;
    m.rotation.z = Math.sin(w * 0.5 + 1) * 0.02;
  });

  return (
    <group ref={outer} position={[L.pos[0], L.pos[1], L.pos[2]]} scale={L.scale}>
      <mesh ref={inner} geometry={geometry} material={material} castShadow />
    </group>
  );
}

function Halo({ layout }: { layout: HeroLayout }) {
  const texture = useMemo(makeHaloTexture, []);
  const L = LAYOUT[layout];
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite
      position={[L.pos[0] + (layout === "desktop" ? 0.35 : 0), L.pos[1] - 0.1, -1.1]}
      scale={layout === "desktop" ? [4.2, 4.2, 1] : [3.2, 3.2, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent
        opacity={layout === "desktop" ? 0.32 : 0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

const DUST_COUNT = 360;

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const { base, phase } = useMemo(() => {
    const base = new Float32Array(DUST_COUNT * 3);
    const phase = new Float32Array(DUST_COUNT);
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < DUST_COUNT; i++) {
      base[i * 3] = (rnd() - 0.5) * 6;
      base[i * 3 + 1] = (rnd() - 0.5) * 3.4;
      base[i * 3 + 2] = -2.2 + rnd() * 3;
      phase[i] = rnd() * TAU;
    }
    return { base, phase };
  }, []);
  const positions = useMemo(() => base.slice(), [base]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = manualTime.value ?? state.clock.elapsedTime;
    const w = (TAU * t) / HERO_LOOP_SECONDS;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3] = base[i * 3] + Math.sin(w + phase[i]) * 0.08;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(w * 2 + phase[i] * 1.7) * 0.06;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        color={SIGNAL}
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** Most do renderu klatek: window.__heroSetTime(t) ustawia czas i renderuje jedną klatkę. */
function ManualClock() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    window.__heroSetTime = (t: number) => {
      manualTime.value = t;
      advance(performance.now());
    };
    return () => {
      delete window.__heroSetTime;
      manualTime.value = null;
    };
  }, [advance]);
  return null;
}

export default function HeroScene({
  onReady,
  layout = "desktop",
  manual = false,
}: {
  onReady?: () => void;
  layout?: HeroLayout;
  manual?: boolean;
}) {
  return (
    <Canvas
      dpr={manual ? 1 : [1, 1.5]}
      frameloop={manual ? "never" : "always"}
      camera={{ fov: 32, position: [0, 0, 4.2], near: 0.1, far: 30 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x0a0a0a, 1);
        scene.fog = new THREE.Fog(0x0a0a0a, 3.2, 7.5);
        onReady?.();
      }}
      className="!pointer-events-none"
      aria-hidden="true"
    >
      <ambientLight intensity={0.12} />
      {/* key: ciepła biel z góry-prawa, lekko z przodu */}
      <directionalLight position={[2.6, 3.2, 3.5]} intensity={1.35} color={0xfff4d6} />
      {/* rim: żółte światło zza bryły, z lewej — zapala fazy i boki */}
      <directionalLight position={[-3.5, 1.2, -2.5]} intensity={0.95} color={SIGNAL} />
      {/* drugi rim z prawej-dołu, słabszy — żeby obie strony miały krawędź */}
      <directionalLight position={[3.5, -2, -2]} intensity={0.45} color={SIGNAL} />
      {/* fill: słaby, z dołu, żeby czerń nie zlewała się w plamę */}
      <directionalLight position={[0.5, -3, 2]} intensity={0.25} color={0xffffff} />

      <Halo layout={layout} />
      <Dust />
      <Mark layout={layout} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.25}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>

      {manual && <ManualClock />}
    </Canvas>
  );
}
