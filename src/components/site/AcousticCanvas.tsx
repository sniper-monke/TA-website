import { useEffect, useRef, useState } from "react";

const ACCENTS = ["#D4A373", "#C85A27", "#4A3525", "#E8E3D5", "#F4F0EA"];
const PALETTE = ["#4A3525", "#D4A373", "#E8E3D5", "#2D2D2F", "#C85A27"];
const SLAT_COUNT = 35;
const PARTICLE_COUNT = 360;

type ThreeModule = typeof import("three");
type ChapterRef = { current: number };

type Engine = {
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

function targetFor(
  mode: number,
  index: number,
  total: number,
  time: number,
): [number, number, number, number, number, number] {
  const ratio = index / total;
  const angle = ratio * Math.PI * 2;

  if (mode === 1) {
    const column = index % 7;
    const row = Math.floor(index / 7);
    return [
      (column - 3) * 0.48,
      Math.sin(column * 0.9 + row * 0.7 + time * 1.25) * 0.58,
      (row - 2) * 0.48,
      0.05,
      0.15,
      0.8 + Math.sin(angle * 5) * 0.35,
    ];
  }
  if (mode === 2) {
    const cluster = index % 4;
    const side = cluster < 2 ? -1 : 1;
    const depth = cluster % 2 ? -1 : 1;
    return [
      side * (1.05 + (index % 5) * 0.18),
      -0.85 + (index % 3) * 0.18,
      depth * (0.9 + (index % 4) * 0.2),
      0.45 * side,
      0.4 * depth,
      1.75,
    ];
  }
  if (mode === 3) {
    const u = ratio * Math.PI;
    return [
      (u - Math.PI / 2) * 1.48,
      Math.sin(u) * 1.42 - 0.48,
      Math.cos(u * 2) * 0.48,
      0.15,
      -Math.cos(u) * 0.78,
      1.08,
    ];
  }
  if (mode === 4) {
    return [
      (index - total / 2) * 0.155,
      -0.42,
      Math.sin(angle * 3) * 0.34,
      0,
      0,
      0.55 + Math.abs(Math.sin(index * 0.68 + time * 1.8)) * 1.65,
    ];
  }
  return [
    Math.cos(angle) * 1.58,
    Math.sin(angle * 2 + time * 0.9) * 0.2,
    Math.sin(angle) * 1.58,
    0.35,
    angle,
    0.92 + Math.sin(angle * 4 + time) * 0.24,
  ];
}

function createEngine(host: HTMLElement, chapterRef: ChapterRef, THREE: ThreeModule): Engine {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#0A0A0A", 5.5, 13);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.55, 7);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.setClearAlpha(0);
  host.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight("#F4F0EA", 0.7);
  const spot = new THREE.SpotLight("#F4F0EA", 210);
  spot.position.set(5, 4, 6);
  spot.angle = 0.55;
  spot.penumbra = 0.7;
  const point = new THREE.PointLight("#C85A27", 26);
  point.position.set(-4, -2, 3);
  const directional = new THREE.DirectionalLight("#E8E3D5", 1.2);
  directional.position.set(-6, 3, 4);
  scene.add(ambient, spot, point, directional);

  const rig = new THREE.Group();
  scene.add(rig);

  const slatGeometry = new THREE.BoxGeometry(0.075, 1.35, 0.16);
  const slatAccent = new THREE.Color();
  const slats = Array.from({ length: SLAT_COUNT }, (_, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE[index % PALETTE.length] ?? PALETTE[0]!),
      roughness: 0.62,
      metalness: 0.12,
      emissive: new THREE.Color(ACCENTS[chapterRef.current] ?? ACCENTS[0]!),
      emissiveIntensity: 0.07,
    });
    const mesh = new THREE.Mesh(slatGeometry, material);
    rig.add(mesh);
    return { mesh, material, target: new THREE.Vector3() };
  });

  const rings = new THREE.Group();
  const ringMeshes = [2.15, 2.65, 3.15].map((radius, index) => {
    const geometry = new THREE.TorusGeometry(radius, 0.006 + index * 0.002, 8, 160);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(index === 1 ? "#C85A27" : "#F4F0EA"),
      transparent: true,
      opacity: index === 1 ? 0.36 : 0.13,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    rings.add(mesh);
    return mesh;
  });
  rig.add(rings);

  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    particlePositions[index * 3] = (Math.random() - 0.5) * 9;
    particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 5;
    particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: new THREE.Color("#E8E3D5"),
    size: 0.015,
    transparent: true,
    opacity: 0.34,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  rig.add(particles);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let elapsed = 0;
  let last = performance.now();
  let raf = 0;
  let running = false;

  const resize = () => {
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const update = (time: number, snap: boolean) => {
    const mode = chapterRef.current;
    const positionLerp = snap ? 1 : 0.075;
    const rotationLerp = snap ? 1 : 0.07;
    const scaleLerp = snap ? 1 : 0.08;
    const emissiveLerp = snap ? 1 : 0.035;
    slatAccent.set(ACCENTS[mode] ?? ACCENTS[0]!);

    for (let index = 0; index < slats.length; index += 1) {
      const slat = slats[index]!;
      const [x, y, z, rx, rz, sy] = targetFor(mode, index, slats.length, time);
      slat.target.set(x, y, z);
      slat.mesh.position.lerp(slat.target, positionLerp);
      slat.mesh.rotation.x = THREE.MathUtils.lerp(slat.mesh.rotation.x, rx, rotationLerp);
      slat.mesh.rotation.z = THREE.MathUtils.lerp(slat.mesh.rotation.z, rz, rotationLerp);
      slat.mesh.scale.y = THREE.MathUtils.lerp(slat.mesh.scale.y, sy, scaleLerp);
      slat.material.emissive.lerp(slatAccent, emissiveLerp);
    }

    rings.rotation.z = time * 0.06 + mode * 0.22;
    rings.rotation.x = Math.PI / 2.25 + Math.sin(time * 0.35) * 0.08;
    particles.rotation.y = time * 0.025;

    const frustumHeight =
      2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const frustumWidth = frustumHeight * camera.aspect;
    const wide = frustumWidth > 7;
    rig.position.x = THREE.MathUtils.lerp(rig.position.x, wide ? 1.32 : 0, snap ? 1 : 0.045);
    rig.position.y = THREE.MathUtils.lerp(rig.position.y, wide ? -0.08 : -0.9, snap ? 1 : 0.045);
    rig.rotation.y = time * 0.11 + mode * 0.18;
  };

  const render = () => renderer.render(scene, camera);

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const delta = Math.min(0.1, (now - last) / 1000);
    last = now;
    elapsed += delta;
    update(elapsed, false);
    render();
  };

  resize();
  window.addEventListener("resize", resize);

  return {
    start() {
      if (running) return;
      if (reducedMotion) {
        update(elapsed, true);
        render();
        return;
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      slatGeometry.dispose();
      for (const slat of slats) slat.material.dispose();
      for (const ring of ringMeshes) {
        ring.geometry.dispose();
        ring.material.dispose();
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function AcousticCanvas({
  activeChapter,
  active,
}: {
  activeChapter: number;
  active: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef(activeChapter);
  const activeRef = useRef(active);
  const engineRef = useRef<Engine | null>(null);
  const [mounted, setMounted] = useState(false);

  chapterRef.current = activeChapter;
  activeRef.current = active;

  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  useEffect(() => {
    if (!mounted || import.meta.env.SSR) return;
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    void import("three").then((THREE) => {
      if (disposed) return;
      const engine = createEngine(host, chapterRef, THREE);
      engineRef.current = engine;
      if (activeRef.current) engine.start();
    });
    return () => {
      disposed = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (active) engineRef.current?.start();
    else engineRef.current?.stop();
  }, [active, mounted]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="webgl-acoustic-instrument"
      className="acoustic-canvas"
      style={{ display: active ? "block" : "none" }}
    />
  );
}
