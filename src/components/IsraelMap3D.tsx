"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";
import type { Party } from "@/data/parties";
import { placeParties, ring } from "@/lib/layout";

const SEAT_HEIGHT = 0.07;
const BASE_DEPTH = 0.35;

function IsraelShape() {
  const { geometry, edges } = useMemo(() => {
    const shape = new THREE.Shape(
      ring.map(([x, y]) => new THREE.Vector2(x, y)),
    );
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: BASE_DEPTH,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      bevelSegments: 2,
    });
    const edges = new THREE.EdgesGeometry(geometry, 30);
    return { geometry, edges };
  }, []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -BASE_DEPTH, 0]}>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#334155"
          emissive="#0c4a6e"
          emissiveIntensity={0.35}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#7dd3fc" />
      </lineSegments>
    </group>
  );
}

function Pillar({
  party,
  position,
  selected,
  dimmed,
  onSelect,
}: {
  party: Party;
  position: [number, number];
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const height = Math.max(party.poll, 0.6) * SEAT_HEIGHT;
  // Map plane: x east, y north. Scene: x east, -z north.
  const [x, z] = [position[0], -position[1]];
  const lit = selected || hover;

  return (
    <group position={[x, 0, z]}>
      <mesh
        position={[0, height / 2, 0]}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(party.id);
        }}
      >
        <cylinderGeometry args={[0.2, 0.2, height, 32]} />
        <meshStandardMaterial
          color={party.color}
          emissive={party.color}
          emissiveIntensity={lit ? 0.9 : 0.25}
          transparent
          opacity={dimmed ? 0.25 : party.poll === 0 ? 0.45 : 1}
        />
      </mesh>
      {/* Small parties only show their label on hover, to keep the map readable. */}
      {(party.poll >= 8 || lit) && (
        <Html
          position={[0, height + 0.25, 0]}
          center
          distanceFactor={8}
          zIndexRange={[10, 0]}
        >
          <button
            onClick={() => onSelect(party.id)}
            dir="rtl"
            className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-semibold text-white shadow transition ${
              dimmed ? "opacity-30" : ""
            } ${lit ? "ring-2 ring-white" : ""}`}
            style={{ background: party.color }}
          >
            {party.name} · {party.poll}
          </button>
        </Html>
      )}
    </group>
  );
}

export default function IsraelMap3D({
  parties,
  selectedId,
  focusBloc,
  onSelect,
}: {
  parties: Party[];
  selectedId: string | null;
  focusBloc: Party["bloc"] | null;
  onSelect: (id: string | null) => void;
}) {
  const positions = useMemo(() => placeParties(parties), [parties]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 6.2, 6.4], fov: 42 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 14, 30]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 4]} intensity={1.4} castShadow />
      <pointLight position={[-4, 3, -4]} intensity={20} color="#38bdf8" />
      <group position={[0, 0, -0.5]}>
        <IsraelShape />
        {parties.map((p) => (
          <Pillar
            key={p.id}
            party={p}
            position={positions[p.id]}
            selected={selectedId === p.id}
            dimmed={focusBloc !== null && p.bloc !== focusBloc}
            onSelect={onSelect}
          />
        ))}
      </group>
      <gridHelper
        args={[30, 60, "#0f172a", "#0f172a"]}
        position={[0, -BASE_DEPTH - 0.06, 0]}
      />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
