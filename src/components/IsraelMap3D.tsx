"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MAJORITY, type Party } from "@/data/parties";
import { placeParties, ring } from "@/lib/layout";
import {
  CELL_ISRAEL,
  CELL_WATER,
  type Terrain,
  cellHeight,
  extent,
  lonLatToMap,
  loadTerrain,
  sampleHeight,
} from "@/lib/terrain";
import meta from "@/data/terrain-meta.json";

const SEAT_HEIGHT = 0.085;
const GOLD = "#fbbf24";
// The Knesset, in Jerusalem: where coalition arcs meet.
const KNESSET = lonLatToMap(35.205, 31.777);
const KNESSET_Y = 2.4;

// Map plane (x east, y north) to scene (x east, -z north).
const toScene = (x: number, y: number, h: number) => new THREE.Vector3(x, h, -y);

const palette = {
  coast: new THREE.Color("#4f7d3a"),
  hills: new THREE.Color("#8a8f4a"),
  desert: new THREE.Color("#c8a46a"),
  desertHigh: new THREE.Color("#9c7a4c"),
  rock: new THREE.Color("#7a6a58"),
  snow: new THREE.Color("#eef2f7"),
  water: new THREE.Color("#0b5394"),
  night: new THREE.Color("#0f172a"),
};

function landColor(metres: number, lat: number, out: THREE.Color) {
  // North is green, the Negev is sand; blend between 30.9° and 31.6°.
  const south = THREE.MathUtils.smoothstep(lat, 30.9, 31.6);
  const low = palette.desert.clone().lerp(palette.coast, south);
  const mid = palette.desertHigh.clone().lerp(palette.hills, south);
  if (metres < 300) out.copy(low).lerp(mid, Math.max(0, metres) / 300);
  else if (metres < 1100) out.copy(mid).lerp(palette.rock, (metres - 300) / 800);
  else out.copy(palette.rock).lerp(palette.snow, THREE.MathUtils.smoothstep(metres, 1700, 2500));
  return out;
}

function TerrainMesh({ terrain }: { terrain: Terrain }) {
  const geometry = useMemo(() => {
    const { w, h } = terrain;
    const pos = new Float32Array(w * h * 3);
    const col = new Float32Array(w * h * 3);
    const c = new THREE.Color();
    for (let r = 0; r < h; r++) {
      const lat = meta.lat1 - (r / (h - 1)) * (meta.lat1 - meta.lat0);
      const my = extent.y1 - (r / (h - 1)) * (extent.y1 - extent.y0);
      for (let q = 0; q < w; q++) {
        const i = r * w + q;
        const mx = extent.x0 + (q / (w - 1)) * (extent.x1 - extent.x0);
        pos.set([mx, cellHeight(terrain, i), -my], i * 3);
        const kind = terrain.kind[i];
        if (kind === CELL_WATER) c.copy(palette.water);
        else {
          landColor(terrain.heights[i], lat, c);
          // Neighbouring land is shown dark so Israel stands out.
          if (kind !== CELL_ISRAEL) c.lerp(palette.night, 0.55);
        }
        // Fade the grid's land edge into the night so it has no hard border.
        const edge = Math.min(q, w - 1 - q, r, h - 1 - r);
        if (edge < 24 && kind !== CELL_WATER) c.lerp(palette.night, 1 - edge / 24);
        col.set([c.r, c.g, c.b], i * 3);
      }
    }
    const index: number[] = [];
    for (let r = 0; r < h - 1; r++) {
      for (let q = 0; q < w - 1; q++) {
        const a = r * w + q;
        index.push(a, a + w, a + 1, a + 1, a + w, a + w + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
  }, [terrain]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

function Sea() {
  // Open water beyond the terrain grid (west of it, and north of it off the
  // Lebanese coast), so the coast doesn't end in a cliff. It must not cover
  // the grid itself: the Jordan valley is below sea level.
  const [coastX] = lonLatToMap(35.08, 33.45);
  const material = <meshStandardMaterial color={palette.water} roughness={0.25} metalness={0.3} />;
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
      {/* Dark ground under everything, below the Dead Sea, so the land beyond the grid isn't a void. */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color={palette.night} />
      </mesh>
      <mesh position={[extent.x0 - 20, 0, 0]}>
        <planeGeometry args={[40.05, 80]} />
        {material}
      </mesh>
      <mesh position={[(extent.x0 + coastX) / 2, extent.y1 + 20 - 0.02, 0]}>
        <planeGeometry args={[coastX - extent.x0, 40]} />
        {material}
      </mesh>
    </group>
  );
}

function Border({ terrain }: { terrain: Terrain }) {
  const points = useMemo(
    () => [...ring, ring[0]].map(([x, y]) => toScene(x, y, sampleHeight(terrain, x, y) + 0.03)),
    [terrain],
  );
  return <Line points={points} color="#67e8f9" lineWidth={2} transparent opacity={0.9} />;
}

function Beam({
  party,
  base,
  selected,
  inCoalition,
  dimmed,
  coalitionMode,
  onClick,
}: {
  party: Party;
  base: THREE.Vector3;
  selected: boolean;
  inCoalition: boolean;
  dimmed: boolean;
  coalitionMode: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const glow = useRef<THREE.Mesh>(null);
  const height = Math.max(party.poll, 0.8) * SEAT_HEIGHT;
  const color = inCoalition ? GOLD : party.color;
  const lit = selected || hover || inCoalition;

  useFrame(({ clock }) => {
    if (!glow.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2 + base.x * 3) * 0.08 + (lit ? 0.25 : 0);
    glow.current.scale.set(s, 1, s);
  });

  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHover(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHover(false);
      document.body.style.cursor = "";
    },
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onClick();
    },
  };

  return (
    <group position={base}>
      {/* Solid core */}
      <mesh position={[0, height / 2, 0]} {...handlers}>
        <cylinderGeometry args={[0.07, 0.09, height, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={lit ? 2.2 : 1}
          transparent
          opacity={dimmed ? 0.2 : 1}
          toneMapped={false}
        />
      </mesh>
      {/* Soft outer glow */}
      <mesh ref={glow} position={[0, height / 2, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.16, 0.2, height, 24, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.04 : lit ? 0.32 : 0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Orb on top */}
      <mesh position={[0, height + 0.08, 0]} {...handlers}>
        <sphereGeometry args={[lit ? 0.14 : 0.1, 20, 20]} />
        <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.2 : 1} toneMapped={false} />
      </mesh>
      {/* Ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} raycast={() => null}>
        <ringGeometry args={[0.22, 0.3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.1 : 0.7} toneMapped={false} />
      </mesh>
      {(party.poll >= 8 || lit) && !dimmed && (
        <Html position={[0, height + 0.32, 0]} center zIndexRange={[10, 0]}>
          <button
            onClick={onClick}
            dir="rtl"
            className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-semibold shadow-lg transition ${
              inCoalition ? "text-slate-900" : "text-white"
            } ${selected ? "ring-2 ring-white" : ""}`}
            style={{ background: color }}
          >
            {coalitionMode && (inCoalition ? "✓ " : "+ ")}
            {party.name} · {party.poll}
          </button>
        </Html>
      )}
    </group>
  );
}

function KnessetHub({
  tops,
  seats,
}: {
  tops: THREE.Vector3[];
  seats: number;
}) {
  const hub = useMemo(() => new THREE.Vector3(KNESSET[0], KNESSET_Y, -KNESSET[1]), []);
  const crown = useRef<THREE.Group>(null);
  const won = seats >= MAJORITY;
  const progress = Math.min(1, seats / MAJORITY);

  useFrame(({ clock }) => {
    if (crown.current) {
      crown.current.rotation.y = clock.elapsedTime * (won ? 1.6 : 0.5);
      crown.current.position.y = KNESSET_Y + Math.sin(clock.elapsedTime * 2) * 0.06;
    }
  });

  return (
    <>
      {tops.map((top, i) => {
        const mid = top.clone().lerp(hub, 0.5);
        mid.y += 0.9;
        const curve = new THREE.QuadraticBezierCurve3(top, mid, hub);
        return (
          <Line
            key={i}
            points={curve.getPoints(32)}
            color={GOLD}
            lineWidth={2}
            dashed
            dashSize={0.12}
            gapSize={0.06}
            transparent
            opacity={0.9}
          />
        );
      })}
      <group ref={crown} position={hub}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.04, 16, 64]} />
          <meshBasicMaterial color="#334155" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.07, 16, 64, Math.PI * 2 * progress]} />
          <meshBasicMaterial color={won ? GOLD : "#38bdf8"} toneMapped={false} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color={won ? GOLD : "#e2e8f0"} wireframe toneMapped={false} />
        </mesh>
        <Html center position={[0, 0.75, 0]}>
          <div dir="rtl" className="whitespace-nowrap rounded-lg bg-slate-950/80 px-2 py-1 text-center text-[12px] text-white">
            <div className="font-bold" dir="ltr">
              {seats} / {MAJORITY}
            </div>
            <div className="text-[10px] text-slate-300">הכנסת</div>
          </div>
        </Html>
      </group>
      {won && <Sparkles position={hub} count={160} scale={[3, 3, 3]} size={6} speed={1.5} color={GOLD} />}
    </>
  );
}

// Fly in from space on load, then glide to whichever party is selected.
function CameraRig({ focus, wide }: { focus: THREE.Vector3 | null; wide: boolean }) {
  const { camera, controls } = useThree() as unknown as { camera: THREE.Camera; controls: OrbitControlsImpl | null };
  const intro = useRef(0);
  const goal = useRef<{ target: THREE.Vector3; position: THREE.Vector3 } | null>(null);
  const home = useMemo(
    () => ({ target: new THREE.Vector3(0, 0, 0), position: new THREE.Vector3(0.6, 5.2, 7.2) }),
    [],
  );

  useEffect(() => {
    camera.position.set(0, 45, 30);
  }, [camera]);

  // Coalition mode pulls back so the Knesset ring above Jerusalem is in view.
  const coalitionView = useMemo(
    () => ({ target: new THREE.Vector3(0, 1.1, 0), position: new THREE.Vector3(0.8, 6.4, 8.6) }),
    [],
  );

  useEffect(() => {
    if (intro.current < 1) return;
    goal.current = focus
      ? { target: focus.clone(), position: focus.clone().add(new THREE.Vector3(0.4, 2.8, 4.2)) }
      : wide
        ? coalitionView
        : home;
  }, [focus, wide, home, coalitionView]);

  useFrame((_, dt) => {
    if (!controls) return;
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + dt / 3);
      const e = 1 - Math.pow(1 - intro.current, 3);
      camera.position.lerpVectors(new THREE.Vector3(0, 45, 30), home.position, e);
      controls.target.copy(home.target);
      controls.update();
      return;
    }
    if (goal.current) {
      const a = 1 - Math.exp(-dt * 3);
      controls.target.lerp(goal.current.target, a);
      camera.position.lerp(goal.current.position, a);
      controls.update();
      if (camera.position.distanceTo(goal.current.position) < 0.02) goal.current = null;
    }
  });
  return null;
}

export default function IsraelMap3D({
  parties,
  selectedId,
  focusBloc,
  coalition,
  coalitionMode,
  onPartyClick,
}: {
  parties: Party[];
  selectedId: string | null;
  focusBloc: Party["bloc"] | null;
  coalition: string[];
  coalitionMode: boolean;
  onPartyClick: (id: string) => void;
}) {
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const positions = useMemo(() => placeParties(parties), [parties]);

  useEffect(() => {
    loadTerrain().then(setTerrain);
  }, []);

  const bases = useMemo(() => {
    if (!terrain) return null;
    const out: Record<string, THREE.Vector3> = {};
    for (const p of parties) {
      const [x, y] = positions[p.id];
      out[p.id] = toScene(x, y, sampleHeight(terrain, x, y));
    }
    return out;
  }, [terrain, parties, positions]);

  const coalitionSeats = parties.filter((p) => coalition.includes(p.id)).reduce((s, p) => s + p.poll, 0);
  const coalitionTops =
    bases && coalitionMode
      ? parties
          .filter((p) => coalition.includes(p.id))
          .map((p) => bases[p.id].clone().add(new THREE.Vector3(0, Math.max(p.poll, 0.8) * SEAT_HEIGHT + 0.08, 0)))
      : [];
  const focus = selectedId && bases && !coalitionMode ? bases[selectedId] : null;

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 45, 30], fov: 42, near: 0.05, far: 200 }} gl={{ antialias: true }}>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 16, 42]} />
      <Stars radius={80} depth={40} count={4000} factor={3} fade speed={0.6} />
      <hemisphereLight args={["#bfdbfe", "#1e293b", 0.55]} />
      <directionalLight position={[-6, 8, -3]} intensity={2.2} color="#fff4e0" />
      <directionalLight position={[5, 3, 6]} intensity={0.35} color="#93c5fd" />

      {terrain && bases ? (
        <>
          <TerrainMesh terrain={terrain} />
          <Sea />
          <Border terrain={terrain} />
          {parties.map((p) => (
            <Beam
              key={p.id}
              party={p}
              base={bases[p.id]}
              selected={selectedId === p.id}
              inCoalition={coalitionMode && coalition.includes(p.id)}
              dimmed={!coalitionMode && focusBloc !== null && p.bloc !== focusBloc}
              coalitionMode={coalitionMode}
              onClick={() => onPartyClick(p.id)}
            />
          ))}
          {coalitionMode && <KnessetHub tops={coalitionTops} seats={coalitionSeats} />}
        </>
      ) : (
        <Html center>
          <div className="text-sm text-slate-400">טוען את המפה…</div>
        </Html>
      )}

      <OrbitControls
        makeDefault
        enableDamping
        minDistance={1.5}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.05}
        screenSpacePanning={false}
      />
      <CameraRig focus={focus} wide={coalitionMode} />
    </Canvas>
  );
}
