import {
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { HomeSeriesId } from "./home-content";

const columns = 12;
const rows = 12;
const pieces = columns * rows;

type Piece = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: Color;
};

function buildShape(series: HomeSeriesId): Piece[] {
  return Array.from({ length: pieces }, (_, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col - (columns - 1) / 2;
    const y = (rows - 1) / 2 - row;
    const tone = Math.sin(col * 2.21 + 1) * 0.12;

    if (series === "absorption") {
      const edge = Math.abs(x) / 5.5;
      const slat = row === Math.floor(rows / 2);
      const length = 0.34 - edge * 0.025;
      const front = 0.06 - edge * edge * 0.18;
      return {
        x: x * 0.31,
        y: slat ? 0 : y * length,
        z: slat ? front : front - 0.065,
        width: slat ? 0.256 : 0.17,
        height: slat ? length * rows : 0.25,
        depth: slat ? 0.28 : 0.09,
        color: new Color("#9e603b").multiplyScalar(1 + tone),
      };
    }

    if (series === "diffusion") {
      const depth = 0.24 + (((col * col + row * row) % 17) / 16) * 1.15;
      return {
        x: x * 0.312,
        y: y * 0.312,
        z: depth / 2 - 0.4,
        width: 0.299,
        height: 0.299,
        depth,
        color: new Color("#c99460").multiplyScalar(0.89 + tone + depth * 0.13),
      };
    }

    const panel = Math.floor(col / 4);
    const localX = (col % 4) - 1.5;
    const arc = Math.hypot(localX + (panel - 1) * 0.45, (y + panel - 1) * 0.59);
    const palette = ["#e9dcc9", "#bf673b", "#153a54", "#f3a228"];
    const band = Math.floor(arc * 1.8 + panel) % palette.length;
    return {
      x: (panel - 1) * 1.43 + localX * 0.296,
      y: y * 0.315 + (panel - 1) * 0.13,
      z: 0.12 + panel * 0.12,
      width: 0.299,
      height: 0.319,
      depth: 0.18,
      color: new Color(palette[band]),
    };
  });
}

function makeGrainTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const image = context.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const warp = x + Math.sin(y * 0.053 + x * 0.11) * 3 + Math.sin(y * 0.025) * 4;
      const fiber = Math.sin(warp * 0.61) * 11 + Math.sin(warp * 1.69) * 7;
      const variation = Math.sin(warp * 0.17 + y * 0.018) * 15;
      const index = (y * canvas.width + x) * 4;
      const shade = 223 + fiber + variation + ((x * 59 + y * 13) % 8);
      image.data.set([shade, shade, shade, 255], index);
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export type TimberMorphStage = {
  setSeries: (series: HomeSeriesId) => void;
  setMotion: (active: boolean) => void;
  dispose: () => void;
};

export function createTimberMorph(
  canvas: HTMLCanvasElement,
  onContextLost: () => void,
): TimberMorphStage {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new Scene();
  const camera = new OrthographicCamera(-3, 3, 3, -3, 0.1, 30);
  camera.position.z = 8;

  const key = new DirectionalLight("#fff1df", 3.1);
  key.position.set(-3, 5, 6);
  const edge = new DirectionalLight("#e1f7fa", 1.7);
  edge.position.set(4, -1, -3);
  scene.add(key, edge, new AmbientLight("#fff1dc", 1.15));

  const geometry = new RoundedBoxGeometry(1, 1, 1, 2, 0.075);
  const grain = makeGrainTexture();
  const material = new MeshStandardMaterial({ map: grain, roughness: 0.86 });
  const mesh = new InstancedMesh(geometry, material, pieces);
  mesh.frustumCulled = false;
  const backingMaterial = new MeshStandardMaterial({
    color: "#271e19",
    roughness: 1,
    transparent: true,
  });
  const backing = new Mesh(geometry, backingMaterial);
  backing.scale.set(3.62, 3.88, 0.24);
  backing.position.z = -0.22;
  const assembly = new Group();
  assembly.rotation.set(0.24, -0.43, -0.16);
  assembly.add(mesh, backing);
  scene.add(assembly);

  const piece = new Object3D();
  const shapes = {
    absorption: buildShape("absorption"),
    diffusion: buildShape("diffusion"),
    art: buildShape("art"),
  };
  const painted = shapes.absorption.map((item) => ({ ...item, color: item.color.clone() }));
  const color = new Color();
  let current: HomeSeriesId = "absorption";
  let transition: { from: Piece[]; start: number; initialBacking: number } | null = null;
  let frame = 0;
  let moving = false;
  let previousFrame = 0;
  let orbit = 0;
  let targetX = 0;
  let targetY = 0;
  let tiltX = 0;
  let tiltY = 0;

  const paint = (source: Piece[], destination: Piece[], progress: number, spread = 0) => {
    painted.forEach((state, index) => {
      const a = source[index]!;
      const b = destination[index]!;
      const interpolate = (from: number, to: number) => MathUtils.lerp(from, to, progress);
      state.x = interpolate(a.x, b.x) + Math.sin(index * 1.71) * spread;
      state.y = interpolate(a.y, b.y) + Math.cos(index * 3.27) * spread;
      state.z = interpolate(a.z, b.z) + (index % 3) * spread * 1.32;
      state.width = interpolate(a.width, b.width);
      state.height = interpolate(a.height, b.height);
      state.depth = interpolate(a.depth, b.depth);
      state.color.copy(color.lerpColors(a.color, b.color, progress));
      piece.position.set(state.x, state.y, state.z);
      piece.scale.set(state.width, state.height, state.depth);
      piece.updateMatrix();
      mesh.setMatrixAt(index, piece.matrix);
      mesh.setColorAt(index, state.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  const tick = (now: number) => {
    frame = 0;
    if (document.hidden || (!transition && !moving)) return;
    const elapsed = now - previousFrame;
    if (elapsed >= 29 || transition) {
      previousFrame = now;
      if (moving) {
        orbit += Math.min(elapsed, 50) / 1000;
        tiltX += (targetX - tiltX) * 0.12;
        tiltY += (targetY - tiltY) * 0.12;
        assembly.rotation.set(
          0.24 + Math.sin(orbit * 0.84) * 0.095 + tiltY,
          -0.43 + Math.sin(orbit * 0.71) * 0.22 + tiltX,
          -0.16 + Math.sin(orbit * 0.6) * 0.045,
        );
        assembly.position.y = Math.sin(orbit * 1.46) * 0.13;
      }
      if (transition) {
        const progress = Math.min((now - transition.start) / 1100, 1);
        const eased = progress * progress * (3 - 2 * progress);
        const spread = Math.sin(progress * Math.PI) ** 2 * 0.38;
        backingMaterial.opacity = MathUtils.lerp(
          transition.initialBacking,
          current === "absorption" ? 1 : 0,
          eased,
        );
        backing.visible = backingMaterial.opacity > 0.01;
        paint(transition.from, shapes[current], eased, spread);
        if (progress === 1) transition = null;
      }
      renderer.render(scene, camera);
    }
    if (moving || transition) frame = requestAnimationFrame(tick);
  };

  const resume = () => {
    if (!frame && !document.hidden && (moving || transition)) {
      previousFrame = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  const pointAt = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const bounds = canvas.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.42;
    targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.28;
  };

  const resetPointer = () => {
    targetX = 0;
    targetY = 0;
  };

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    const aspect = width / height;
    const halfHeight = Math.max(2.6, 2.55 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  paint(shapes.absorption, shapes.absorption, 1);
  resize();
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("pointermove", pointAt, { passive: true });
  canvas.addEventListener("pointerleave", resetPointer);
  document.addEventListener("visibilitychange", resume);

  return {
    setSeries(series) {
      if (series === current) return;
      current = series;
      transition = {
        from: painted.map((item) => ({ ...item, color: item.color.clone() })),
        initialBacking: backingMaterial.opacity,
        start: performance.now(),
      };
      resume();
    },
    setMotion(active) {
      moving = active;
      resume();
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("pointermove", pointAt);
      canvas.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", resume);
      mesh.dispose();
      geometry.dispose();
      grain?.dispose();
      material.dispose();
      backingMaterial.dispose();
      renderer.dispose();
    },
  };
}
