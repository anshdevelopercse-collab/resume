"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { markReady, getIntro } from "@/lib/intro";
import { heroScroll } from "@/lib/heroScroll";

/** Deterministic pseudo-random so the shard is identical on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A hexagonal obsidian crystal: lathe profile, vertices jittered so every facet catches light differently. */
function makeShardGeometry(seed: number, jitter = 0.09) {
  const profile = [
    new THREE.Vector2(0.0, -1.95),
    new THREE.Vector2(0.4, -1.25),
    new THREE.Vector2(0.68, -0.25),
    new THREE.Vector2(0.62, 0.95),
    new THREE.Vector2(0.3, 1.6),
    new THREE.Vector2(0.0, 2.0),
  ];
  const lathe = new THREE.LatheGeometry(profile, 6);
  const geo = lathe.toNonIndexed();
  lathe.dispose();

  const rand = mulberry32(seed);
  const moved = new Map<string, THREE.Vector3>();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const key = `${v.x.toFixed(3)}|${v.y.toFixed(3)}|${v.z.toFixed(3)}`;
    let m = moved.get(key);
    if (!m) {
      const atPole = Math.abs(v.x) < 1e-3 && Math.abs(v.z) < 1e-3;
      m = atPole
        ? new THREE.Vector3((rand() - 0.5) * jitter * 1.6, 0, (rand() - 0.5) * jitter * 1.6)
        : new THREE.Vector3((rand() - 0.5) * jitter, (rand() - 0.5) * jitter * 1.4, (rand() - 0.5) * jitter);
      moved.set(key, m);
    }
    pos.setXYZ(i, v.x + m.x, v.y + m.y, v.z + m.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function Shard() {
  const group = useRef<THREE.Group>(null);
  const main = useMemo(() => makeShardGeometry(7), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(main, 20), [main]);

  useEffect(
    () => () => {
      main.dispose();
      edges.dispose();
    },
    [main, edges],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const s = heroScroll.value;
    const targetY = state.pointer.x * 0.5;
    const targetX = -state.pointer.y * 0.25;
    g.rotation.y += delta * (0.16 + s * 1.6);
    g.rotation.x += (targetX + 0.18 + s * 0.9 - g.rotation.x) * Math.min(1, delta * 2.2);
    g.rotation.z += (-targetY * 0.3 + 0.28 - g.rotation.z) * Math.min(1, delta * 2.2);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08 + s * 0.9;
    g.position.x += (targetY * 0.35 - g.position.x) * Math.min(1, delta * 1.5);
  });

  return (
    <group ref={group} scale={1.02}>
      <mesh geometry={main}>
        <meshPhysicalMaterial
          color="#060607"
          metalness={0.35}
          roughness={0.07}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={1.7}
          reflectivity={0.9}
          ior={1.55}
          specularIntensity={1}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#c8a24a" transparent opacity={0.42} />
      </lineSegments>
    </group>
  );
}

/** Small fragments orbiting the main crystal. */
function Fragments() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const geos = useMemo(() => [11, 23, 37, 41].map((s) => makeShardGeometry(s, 0.14)), []);
  const items = useMemo(() => {
    const rand = mulberry32(99);
    return Array.from({ length: 9 }, (_, i) => ({
      geo: geos[i % geos.length],
      radius: 2.2 + rand() * 2.1,
      angle: rand() * Math.PI * 2,
      speed: 0.05 + rand() * 0.09,
      y: (rand() - 0.5) * 3.2,
      scale: 0.07 + rand() * 0.15,
      spin: new THREE.Vector3(rand(), rand(), rand()).multiplyScalar(0.8),
    }));
  }, [geos]);

  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = heroScroll.value;
    items.forEach((it, i) => {
      const m = refs.current[i];
      if (!m) return;
      const a = it.angle + t * it.speed;
      m.position.set(Math.cos(a) * it.radius, it.y + Math.sin(t * 0.4 + i) * 0.12 - s * 1.4, Math.sin(a) * it.radius * 0.55 - 0.8);
      m.rotation.set(t * it.spin.x, t * it.spin.y, t * it.spin.z);
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={it.geo}
          scale={it.scale}
        >
          <meshPhysicalMaterial
            color="#08080a"
            metalness={0.4}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </>
  );
}

/** A gold light that sweeps across the crystal once when the loader drains. */
function SweepLight() {
  const light = useRef<THREE.PointLight>(null);
  const started = useRef<number | null>(null);
  useFrame((state) => {
    const l = light.current;
    if (!l) return;
    if (started.current === null && getIntro() !== "pending") started.current = state.clock.elapsedTime;
    const t = started.current === null ? -1 : (state.clock.elapsedTime - started.current) / 2.4;
    if (t < 0) {
      l.intensity = 0;
      return;
    }
    const k = Math.min(1, t);
    l.position.set(-6 + k * 12, 1.5 - k * 1.2, 2.6);
    l.intensity = Math.sin(k * Math.PI) * 120;
  });
  return <pointLight ref={light} color="#ffd98a" distance={14} decay={2} />;
}

function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current++;
    if (frames.current === 3) markReady("hero");
  });
  return null;
}

export default function HeroScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 9.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.06} />
      <Environment resolution={256} frames={1}>
        {/* Procedural studio: no HDR download. Gold strip left, white strip right, warm floor, soft top. */}
        <Lightformer form="rect" intensity={7} color="#e9c872" position={[-5, 2.5, -1]} rotation-y={Math.PI / 2} scale={[9, 1.1, 1]} />
        <Lightformer form="rect" intensity={5} color="#ffffff" position={[4.5, 1, 2.5]} rotation-y={-Math.PI / 2.4} scale={[1.1, 9, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#c8a24a" position={[0, -4, 1.5]} rotation-x={-Math.PI / 2} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#fff6e0" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[7, 7, 1]} />
        <Lightformer form="circle" intensity={3} color="#e7d3a1" position={[0, 0, -6]} scale={5} />
      </Environment>
      <SweepLight />
      <Shard />
      <Fragments />
      <Sparkles count={70} scale={[9, 6, 4]} size={2.2} speed={0.25} opacity={0.55} color="#e7d3a1" />
      <ReadySignal />
    </Canvas>
  );
}
