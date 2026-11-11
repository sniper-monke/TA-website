import type * as Three from "three";
import type { TimberFinish } from "./MaterialStudy";

export type AlcoveMode = "space" | "layers" | "sound";
export type AlcoveView = "angle" | "front" | "inside";
export type AlcoveLayer = "timber" | "backing" | "gap";
export type ListeningState = {
  finish: TimberFinish;
  exploded: boolean;
  active: boolean;
  mode: AlcoveMode;
  view: AlcoveView;
  layer: AlcoveLayer;
  treated: boolean;
  pulse: number;
  reset: number;
};
export type ListeningEngine = { update: (state: ListeningState) => void; dispose: () => void };

/** Browser-only treatment study. Its geometry is independent of catalogue products. */
export function createListeningScene(
  host: HTMLDivElement,
  THREE: typeof Three,
  initial: ListeningState,
  onUnavailable: () => void,
): ListeningEngine {
  const resources: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(resource: T): T => {
    resources.push(resource);
    return resource;
  };
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  host.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
  const rig = new THREE.Group();
  scene.add(rig);
  const hemisphere = new THREE.HemisphereLight("#fff2dc", "#6f746d", 2.2);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight("#fff4de", 4.2);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 6, bottom: -3, near: 0.1, far: 18 });
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.025;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight("#dae8ed", 1.1);
  fill.position.set(5, 3, -2);
  scene.add(fill);
  const glow = new THREE.PointLight("#ffb16d", 8, 5);
  glow.position.set(-1.1, 1.9, -0.6);
  rig.add(glow);
  const travellingLight = new THREE.PointLight("#ffcd92", 7, 6);
  travellingLight.position.set(0.4, 3.6, 2);
  rig.add(travellingLight);

  const material = (colour: string, roughness = 0.85) =>
    keep(new THREE.MeshStandardMaterial({ color: colour, roughness, metalness: 0 }));
  const mesh = (geometry: Three.BufferGeometry, surface: Three.Material, parent = rig) => {
    const item = new THREE.Mesh(geometry, surface);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  };
  const arch = (outer: number, inner: number, top: number, innerTop: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-outer, 0);
    shape.lineTo(-outer, 2.55);
    shape.quadraticCurveTo(-outer, top, -0.78, top);
    shape.lineTo(0.78, top);
    shape.quadraticCurveTo(outer, top, outer, 2.55);
    shape.lineTo(outer, 0);
    shape.lineTo(inner, 0);
    shape.lineTo(inner, 2.55);
    shape.quadraticCurveTo(inner, innerTop, 0.78, innerTop);
    shape.lineTo(-0.78, innerTop);
    shape.quadraticCurveTo(-inner, innerTop, -inner, 2.55);
    shape.lineTo(-inner, 0);
    shape.closePath();
    return shape;
  };
  const felt = material("#2c3532", 1);
  const backing = mesh(
    keep(
      new THREE.ExtrudeGeometry(arch(1.685, 1.66, 3.425, 3.4), {
        depth: 2.72,
        bevelEnabled: false,
        curveSegments: 22,
      }),
    ),
    felt,
  );
  backing.position.z = -1.4;
  const end = new THREE.Shape();
  end.moveTo(-1.755, 0);
  end.lineTo(-1.755, 2.55);
  end.quadraticCurveTo(-1.755, 3.505, -0.78, 3.505);
  end.lineTo(0.78, 3.505);
  end.quadraticCurveTo(1.755, 3.505, 1.755, 2.55);
  end.lineTo(1.755, 0);
  end.closePath();
  const rear = mesh(keep(new THREE.ShapeGeometry(end, 24)), felt);
  rear.position.z = -1.39;

  // Sample a timber face from the existing photograph through UV coordinates.
  let disposed = false;
  const wood = keep(
    new THREE.TextureLoader().load(
      "/images/timber-hero.webp",
      () => {
        if (!disposed) requestDraw();
      },
      undefined,
      () => {
        if (!disposed) requestDraw();
      },
    ),
  );
  wood.colorSpace = THREE.SRGBColorSpace;
  wood.wrapS = wood.wrapT = THREE.MirroredRepeatWrapping;
  wood.repeat.set(0.008, 0.48);
  wood.offset.set(0.004, 0.48);
  wood.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const ribGeometry = keep(
    new THREE.ExtrudeGeometry(arch(1.75, 1.58, 3.5, 3.32), {
      depth: 0.105,
      bevelEnabled: true,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      bevelSegments: 2,
      steps: 1,
      curveSegments: 22,
    }),
  );
  const uv = ribGeometry.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + 2) / 4, uv.getY(i) / 3.6);
  const ribs = Array.from({ length: 15 }, (_, index) => {
    const surface = keep(
      new THREE.MeshStandardMaterial({ map: wood, color: "#ffffff", roughness: 0.64 }),
    );
    const rib = mesh(ribGeometry, surface);
    rib.position.z = -1.3 + index * 0.184;
    return { rib, surface, z: rib.position.z, variation: 0.93 + (index % 4) * 0.035 };
  });

  const lightStrip = mesh(
    keep(new THREE.BoxGeometry(0.025, 1.7, 0.025)),
    keep(new THREE.MeshBasicMaterial({ color: "#ffd39a" })),
  );
  lightStrip.position.set(-1.35, 1.85, -1.35);

  const rounded = (width: number, height: number, radius: number) => {
    const s = new THREE.Shape();
    s.moveTo(radius, 0);
    s.lineTo(width - radius, 0);
    s.quadraticCurveTo(width, 0, width, radius);
    s.lineTo(width, height - radius);
    s.quadraticCurveTo(width, height, width - radius, height);
    s.lineTo(radius, height);
    s.quadraticCurveTo(0, height, 0, height - radius);
    s.lineTo(0, radius);
    s.quadraticCurveTo(0, 0, radius, 0);
    return keep(
      new THREE.ExtrudeGeometry(s, {
        depth: 0.12,
        bevelEnabled: true,
        bevelSize: 0.065,
        bevelThickness: 0.065,
        bevelSegments: 4,
        curveSegments: 14,
      }),
    );
  };
  const upholstery = material("#b45f38", 0.97);
  const metal = material("#253b42", 0.5);
  const chair = new THREE.Group();
  chair.position.set(-0.12, 0, -0.12);
  chair.rotation.y = -0.13;
  rig.add(chair);
  const seat = mesh(rounded(1.04, 0.86, 0.23), upholstery, chair);
  seat.rotation.x = -Math.PI / 2;
  seat.position.set(-0.52, 0.55, 0.42);
  const chairBack = mesh(rounded(1.04, 0.83, 0.27), upholstery, chair);
  chairBack.position.set(-0.52, 0.75, -0.48);
  chairBack.rotation.x = -0.1;
  const legGeometry = keep(new THREE.CylinderGeometry(0.022, 0.019, 0.6, 12));
  for (const x of [-0.42, 0.42])
    for (const z of [-0.32, 0.32]) {
      const leg = mesh(legGeometry, metal, chair);
      leg.position.set(x, 0.28, z);
      leg.rotation.z = x > 0 ? -0.08 : 0.08;
    }
  const tableTop = mesh(keep(new THREE.CylinderGeometry(0.3, 0.3, 0.045, 48)), material("#d9cdb8"));
  tableTop.position.set(1.03, 0.58, 0.05);
  const tableLeg = mesh(keep(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 16)), metal);
  tableLeg.position.set(1.03, 0.28, 0.05);
  const tableFoot = mesh(keep(new THREE.CylinderGeometry(0.19, 0.21, 0.025, 32)), metal);
  tableFoot.position.set(1.03, 0.015, 0.05);

  const fadeCanvas = document.createElement("canvas");
  fadeCanvas.width = fadeCanvas.height = 128;
  const context = fadeCanvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 26, 64, 64, 64);
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(1, "#000");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const floorFade = keep(new THREE.CanvasTexture(fadeCanvas));
  const floor = mesh(
    keep(new THREE.PlaneGeometry(5.6, 5.2)),
    keep(
      new THREE.MeshStandardMaterial({
        color: "#d9cfba",
        roughness: 1,
        transparent: true,
        alphaMap: floorFade,
        depthWrite: false,
      }),
    ),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -0.025, 0.25);
  floor.castShadow = false;

  const gapGuide = new THREE.LineSegments(
    keep(new THREE.EdgesGeometry(keep(new THREE.BoxGeometry(0.16, 2.45, 2.45)))),
    keep(
      new THREE.LineBasicMaterial({
        color: "#bf673b",
        transparent: true,
        opacity: 0.65,
        depthTest: false,
      }),
    ),
  );
  gapGuide.position.set(1.63, 1.55, -0.05);
  gapGuide.renderOrder = 8;
  rig.add(gapGuide);

  // Deliberately illustrative reflection paths, not a physical acoustic solver.
  const pathControls = [
    [
      [0, 1.45, 0.65],
      [-1.42, 2.2, -0.2],
      [0.65, 2.45, -1.2],
      [1.43, 1.65, 0.35],
      [-1.4, 1.15, 0.8],
      [0.3, 2.4, -1.2],
    ],
    [
      [0, 1.45, 0.65],
      [1.43, 2.05, -0.15],
      [-0.7, 2.65, -1.2],
      [-1.42, 1.5, 0.15],
      [1.38, 1.1, 0.9],
      [-0.3, 2.2, -1.2],
    ],
    [
      [0, 1.45, 0.65],
      [0.8, 2.85, -0.6],
      [-1.42, 2.1, -0.8],
      [1.43, 1.25, 0.45],
      [-0.8, 2.55, -1.2],
      [1.4, 2.25, 0.6],
    ],
  ];
  const soundField = new THREE.Group();
  rig.add(soundField);
  const dotGeometry = keep(new THREE.SphereGeometry(0.045, 12, 8));
  const soundPaths = pathControls.map((control) => {
    const anchors = control.map((point) => new THREE.Vector3(point[0], point[1], point[2]));
    const points: Three.Vector3[] = [];
    for (let segment = 0; segment < anchors.length - 1; segment++)
      for (let step = 0; step < 32; step++)
        points.push(anchors[segment]!.clone().lerp(anchors[segment + 1]!, step / 32));
    points.push(anchors[anchors.length - 1]!.clone());
    const geometry = keep(new THREE.BufferGeometry().setFromPoints(points));
    const surface = keep(
      new THREE.LineDashedMaterial({
        color: "#248082",
        transparent: true,
        opacity: 0.8,
        dashSize: 0.065,
        gapSize: 0.04,
        depthTest: false,
      }),
    );
    const line = new THREE.Line(geometry, surface);
    line.computeLineDistances();
    line.renderOrder = 10;
    soundField.add(line);
    const dotSurface = keep(
      new THREE.MeshBasicMaterial({ color: "#248082", transparent: true, depthTest: false }),
    );
    const dot = new THREE.Mesh(dotGeometry, dotSurface);
    dot.renderOrder = 11;
    soundField.add(dot);
    return { points, geometry, surface, line, dot, dotSurface };
  });

  let state = initial;
  let visible = true;
  let lost = false;
  let frame = 0;
  let last = 0;
  let phase = 0;
  let reveal = initial.exploded ? 1 : 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let settling = false;
  let pulseAge = initial.pulse ? 0 : 5;
  let wasBare = initial.mode === "sound" && !initial.treated;
  const presets = {
    angle: { yaw: 0.45, height: 3.2, distance: 8.7 },
    front: { yaw: 0, height: 2.6, distance: 8.8 },
    inside: { yaw: 0.04, height: 2.25, distance: 5.9 },
  };
  let orbitYaw = presets[initial.view].yaw;
  let orbitPitch = 0;
  let cameraYaw = orbitYaw;
  let cameraPitch = 0;
  let cameraDistance = presets[initial.view].distance;
  let cameraHeight = presets[initial.view].height;
  let dragging = false;
  let dragX = 0;
  let dragY = 0;
  const finishes = { oak: "#ffffff", walnut: "#9b7051", ebony: "#515855" };
  const targetColour = new THREE.Color(finishes[initial.finish]);
  const currentColour = targetColour.clone();
  const draw = (now: number) => {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000 || 0.033, 0.05);
    if (now - last < 32 && state.active) {
      requestDraw();
      return;
    }
    last = now;
    if (state.active) {
      phase += dt;
      pulseAge += dt;
      pointerX += (targetX - pointerX) * 0.07;
      pointerY += (targetY - pointerY) * 0.07;
      travellingLight.position.set(
        Math.sin(phase * 0.3) * 1.3,
        3.6,
        1.6 + Math.cos(phase * 0.22) * 0.6,
      );
    }
    const targetReveal = state.exploded ? 1 : 0;
    const previousReveal = reveal;
    if (state.active) {
      reveal += (targetReveal - reveal) * 0.09;
      currentColour.lerp(targetColour, 0.12);
    } else {
      reveal = targetReveal;
      currentColour.copy(targetColour);
    }
    const bare = state.mode === "sound" && !state.treated;
    if (bare !== wasBare) renderer.shadowMap.needsUpdate = true;
    wasBare = bare;
    ribs.forEach(({ rib, surface, z, variation }, index) => {
      rib.visible = !bare;
      surface.color.copy(currentColour).multiplyScalar(variation);
      surface.emissive.set(
        state.mode === "layers" && state.layer === "timber" ? "#bf673b" : "#000000",
      );
      surface.emissiveIntensity = 0.16;
      const front = Math.max(0, (index - 9) / 5);
      rib.position.z = z + reveal * front * 0.85;
      rib.position.x = reveal * front * 0.5;
    });
    backing.position.set(-reveal * 0.18, 0, -1.4 - reveal * 0.35);
    rear.position.set(-reveal * 0.18, 0, -1.39 - reveal * 0.35);
    felt.color.set(state.mode === "sound" && !state.treated ? "#d7c9b2" : "#2c3532");
    felt.emissive.set(state.mode === "layers" && state.layer === "backing" ? "#248082" : "#000000");
    felt.emissiveIntensity = 0.28;
    gapGuide.visible = state.mode === "layers" && state.layer === "gap";
    soundField.visible = state.mode === "sound";
    soundPaths.forEach((path, index) => {
      const progress = state.active ? Math.min(1, Math.max(0, pulseAge / 3.8 - index * 0.08)) : 0.6;
      const reach = state.treated ? Math.min(progress, 0.24) : progress;
      const at = Math.min(path.points.length - 1, Math.floor(reach * (path.points.length - 1)));
      const fade = state.treated
        ? Math.exp(-Math.max(0, progress - 0.18) * 8)
        : Math.exp(-progress * 1.05);
      const alive = !state.active || pulseAge < 4.5;
      path.line.visible = path.dot.visible = alive;
      path.geometry.setDrawRange(0, at + 1);
      path.surface.color.set(state.treated ? "#68b6ac" : "#bf673b");
      path.surface.opacity = fade * 0.85;
      path.dotSurface.color.copy(path.surface.color);
      path.dotSurface.opacity = fade;
      path.dot.position.copy(path.points[at]!);
    });
    const preset = presets[state.view];
    const approach = state.active ? 0.085 : 1;
    cameraYaw += (orbitYaw - cameraYaw) * approach;
    cameraPitch += (orbitPitch - cameraPitch) * approach;
    cameraDistance += (preset.distance - cameraDistance) * approach;
    cameraHeight += (preset.height - cameraHeight) * approach;
    const angle = cameraYaw + pointerX * 0.025;
    camera.position.set(
      Math.sin(angle) * cameraDistance,
      cameraHeight + cameraPitch * 2 + pointerY * 0.08,
      Math.cos(angle) * cameraDistance,
    );
    camera.lookAt(0, state.view === "inside" ? 1.75 : 1.7, state.view === "inside" ? -0.3 : 0);
    if (Math.abs(previousReveal - reveal) > 0.00001) renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
    settling =
      Math.abs(targetReveal - reveal) > 0.001 ||
      Math.abs(cameraYaw - orbitYaw) +
        Math.abs(cameraPitch - orbitPitch) +
        Math.abs(cameraDistance - preset.distance) >
        0.001 ||
      Math.abs(currentColour.r - targetColour.r) +
        Math.abs(currentColour.g - targetColour.g) +
        Math.abs(currentColour.b - targetColour.b) >
        0.001;
    if (state.active || settling) requestDraw();
  };
  function requestDraw() {
    if (!frame && !disposed && !lost && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.fov = camera.aspect < 0.9 ? 42 : 35;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    requestDraw();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (dragging) {
      orbitYaw = Math.max(-0.95, Math.min(0.95, orbitYaw - (event.clientX - dragX) * 0.005));
      orbitPitch = Math.max(-0.25, Math.min(0.35, orbitPitch + (event.clientY - dragY) * 0.004));
      dragX = event.clientX;
      dragY = event.clientY;
      requestDraw();
      return;
    }
    if (!state.active) return;
    const bounds = host.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };
  const leave = () => {
    if (dragging) return;
    targetX = targetY = 0;
  };
  const down = (event: PointerEvent) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    dragging = true;
    dragX = event.clientX;
    dragY = event.clientY;
    host.dataset["dragging"] = "true";
    host.setPointerCapture(event.pointerId);
    event.preventDefault();
  };
  const up = (event: PointerEvent) => {
    dragging = false;
    delete host.dataset["dragging"];
    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
    targetX = targetY = 0;
  };
  const visibility = () => {
    if (document.hidden || !visible) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      last = performance.now();
      requestDraw();
    }
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onUnavailable();
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    visibility();
  });
  const resizeObserver = new ResizeObserver(resize);
  observer.observe(host);
  resizeObserver.observe(host);
  host.addEventListener("pointermove", move, { passive: true });
  host.addEventListener("pointerleave", leave);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  resize();
  return {
    update(next) {
      const motionChanged = state.active !== next.active;
      if (state.view !== next.view || state.reset !== next.reset) {
        orbitYaw = presets[next.view].yaw;
        orbitPitch = 0;
      }
      if (state.pulse !== next.pulse) pulseAge = 0;
      state = next;
      targetColour.set(finishes[next.finish]);
      if (motionChanged) {
        targetX = pointerX;
        targetY = pointerY;
        last = performance.now();
      }
      requestDraw();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      for (const resource of resources) resource.dispose();
      key.shadow.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
