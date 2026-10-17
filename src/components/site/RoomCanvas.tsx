import { useEffect, useRef } from "react";
import type { ConfigDef, ConfigState } from "@/data/configurator";

type Three = typeof import("three");
type RoomEngine = {
  update: (config: ConfigState, def: ConfigDef) => void;
  dispose: () => void;
};

const FALLBACK_FINISH: Record<string, string> = {
  oak: "#c19a65",
  walnut: "#76513a",
  ebony: "#302e2a",
};
const FALLBACK_FELT: Record<string, string> = {
  charcoal: "#292d2a",
  rust: "#a94c2d",
  bone: "#e7e0d2",
};

function roundedBoxGeometry(
  THREE: Three,
  width: number,
  height: number,
  depth: number,
  radius: number,
) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const corner = Math.min(radius, halfWidth * 0.8, halfHeight * 0.8);
  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + corner, -halfHeight);
  shape.lineTo(halfWidth - corner, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + corner);
  shape.lineTo(halfWidth, halfHeight - corner);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - corner, halfHeight);
  shape.lineTo(-halfWidth + corner, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - corner);
  shape.lineTo(-halfWidth, -halfHeight + corner);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + corner, -halfHeight);

  const bevel = Math.min(corner * 0.32, depth * 0.18);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, depth - bevel * 2),
    bevelEnabled: bevel > 0.005,
    bevelSegments: 3,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 8,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2 + bevel);
  geometry.computeVertexNormals();
  return geometry;
}

function textureFromCanvas(THREE: Three, canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function floorTexture(THREE: Three) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 768;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const boards = ["#a9987d", "#b09f85", "#9d8d73", "#ad9c81", "#a49479", "#b2a184"];
  const boardHeight = 96;
  for (let row = 0; row < 8; row += 1) {
    const y = row * boardHeight;
    context.fillStyle = boards[row % boards.length]!;
    context.fillRect(0, y, canvas.width, boardHeight);
    context.strokeStyle = "rgba(61, 48, 34, 0.26)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, y + boardHeight - 2);
    context.lineTo(canvas.width, y + boardHeight - 2);
    context.stroke();

    const offset = row % 2 ? 180 : 0;
    for (let joint = -1; joint < 4; joint += 1) {
      const x = joint * 256 + offset;
      context.strokeStyle = "rgba(63, 49, 35, 0.2)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + boardHeight);
      context.stroke();
    }
    for (let grain = 0; grain < 12; grain += 1) {
      const grainY = y + 8 + grain * 7;
      context.strokeStyle = grain % 3 ? "rgba(67, 51, 35, 0.045)" : "rgba(246, 226, 192, 0.08)";
      context.lineWidth = grain % 4 === 0 ? 2 : 1;
      context.beginPath();
      context.moveTo(12, grainY);
      context.bezierCurveTo(180, grainY - 3, 420, grainY + 2, 755, grainY - 1);
      context.stroke();
    }
  }
  return textureFromCanvas(THREE, canvas);
}

function artworkTexture(THREE: Three) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 512, 384);
  gradient.addColorStop(0, "#34423a");
  gradient.addColorStop(0.58, "#202a25");
  gradient.addColorStop(1, "#171d1a");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 384);
  for (let index = 0; index < 7; index += 1) {
    context.beginPath();
    context.ellipse(258, 196, 72 + index * 28, 26 + index * 17, -0.28, 0, Math.PI * 2);
    context.strokeStyle = index === 3 ? "rgba(207, 133, 77, 0.85)" : "rgba(216, 196, 157, 0.42)";
    context.lineWidth = index === 3 ? 5 : 2;
    context.stroke();
  }
  context.fillStyle = "#d9b278";
  context.beginPath();
  context.arc(378, 90, 17, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(197, 108, 65, 0.9)";
  context.beginPath();
  context.arc(129, 270, 26, 0, Math.PI * 2);
  context.fill();
  return textureFromCanvas(THREE, canvas);
}

function disposeObject(object: import("three").Object3D) {
  object.traverse((child) => {
    const mesh = child as import("three").Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) material.dispose();
  });
}

function createRoomEngine(host: HTMLDivElement, THREE: Three): RoomEngine {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#171b19");
  scene.fog = new THREE.Fog("#171b19", 14, 27);

  const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 80);
  const cameraTarget = new THREE.Vector3(0, 2, -0.3);
  const cameraDirection = new THREE.Vector3(10.8, 6.6, 11.8).normalize();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor("#171b19", 1);
  host.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight("#f3e8d2", "#39443b", 2.15));
  scene.add(new THREE.AmbientLight("#e7e0d2", 0.38));
  const keyLight = new THREE.DirectionalLight("#ffe1b3", 3.2);
  keyLight.position.set(-4, 9, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -8;
  keyLight.shadow.camera.right = 8;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -7;
  keyLight.shadow.bias = -0.00025;
  keyLight.shadow.radius = 5;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight("#a9b6a2", 0.8);
  fillLight.position.set(6, 5, -3);
  scene.add(fillLight);

  const woodMap = floorTexture(THREE);
  const artMap = artworkTexture(THREE);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: "#f0e7d6",
    roughness: 0.82,
    ...(woodMap ? { map: woodMap } : {}),
  });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: "#39433d", roughness: 0.94 });
  const sideWallMaterial = new THREE.MeshStandardMaterial({ color: "#2c3530", roughness: 0.95 });
  const walnutMaterial = new THREE.MeshStandardMaterial({ color: "#795638", roughness: 0.47 });
  const darkWoodMaterial = new THREE.MeshStandardMaterial({ color: "#493321", roughness: 0.55 });
  const sofaMaterial = new THREE.MeshStandardMaterial({ color: "#50584e", roughness: 0.94 });
  const sofaHighlightMaterial = new THREE.MeshStandardMaterial({
    color: "#687162",
    roughness: 0.98,
  });
  const cushionMaterial = new THREE.MeshStandardMaterial({ color: "#98846a", roughness: 1 });
  const rugMaterial = new THREE.MeshStandardMaterial({ color: "#66675f", roughness: 1 });
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: "#252927",
    roughness: 0.38,
    metalness: 0.52,
  });

  const addMesh = (
    parent: import("three").Object3D,
    geometry: import("three").BufferGeometry,
    material: import("three").Material,
    position: [number, number, number],
    options: { castShadow?: boolean; receiveShadow?: boolean } = {},
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = options.castShadow ?? true;
    mesh.receiveShadow = options.receiveShadow ?? true;
    parent.add(mesh);
    return mesh;
  };

  const rounded = (
    parent: import("three").Object3D,
    size: [number, number, number],
    radius: number,
    material: import("three").Material,
    position: [number, number, number],
    options?: { castShadow?: boolean; receiveShadow?: boolean },
  ) => addMesh(parent, roundedBoxGeometry(THREE, ...size, radius), material, position, options);

  addMesh(scene, new THREE.BoxGeometry(9.4, 0.18, 9.4), floorMaterial, [0, -0.09, 0]);
  const rear = addMesh(scene, new THREE.BoxGeometry(9.4, 6.4, 0.22), wallMaterial, [0, 3.2, -4.59]);
  const side = addMesh(
    scene,
    new THREE.BoxGeometry(0.22, 6.4, 9.4),
    sideWallMaterial,
    [-4.59, 3.2, 0],
  );
  rear.castShadow = false;
  side.castShadow = false;

  rounded(scene, [9.25, 0.13, 0.24], 0.045, walnutMaterial, [0, 6.36, -4.48]);
  rounded(scene, [0.24, 0.13, 9.25], 0.045, walnutMaterial, [-4.48, 6.36, 0]);
  rounded(scene, [9.22, 0.12, 0.16], 0.035, darkWoodMaterial, [0, 0.12, -4.43]);
  rounded(scene, [0.16, 0.12, 9.22], 0.035, darkWoodMaterial, [-4.43, 0.12, 0]);

  const rug = rounded(scene, [4.7, 0.045, 2.8], 0.18, rugMaterial, [0, 0.025, 0.2], {
    castShadow: false,
  });
  rug.rotation.y = -0.08;

  // Soft sectional sofa with separate back and seat cushions.
  rounded(scene, [3.65, 0.52, 1.05], 0.2, sofaMaterial, [0, 0.48, -2.96]);
  rounded(scene, [3.62, 1.48, 0.38], 0.2, sofaMaterial, [0, 1.22, -3.45]);
  rounded(scene, [0.46, 1.0, 1.0], 0.2, sofaHighlightMaterial, [-1.62, 0.78, -2.98]);
  rounded(scene, [0.46, 1.0, 1.0], 0.2, sofaHighlightMaterial, [1.62, 0.78, -2.98]);
  for (const x of [-1.05, 0, 1.05]) {
    rounded(scene, [0.99, 0.48, 0.83], 0.2, cushionMaterial, [x, 0.83, -2.63]);
    rounded(scene, [0.99, 0.86, 0.3], 0.18, sofaHighlightMaterial, [x, 1.68, -3.19]);
  }
  const throwPillow = rounded(
    scene,
    [0.56, 0.56, 0.26],
    0.22,
    cushionMaterial,
    [-1.08, 1.25, -2.52],
  );
  throwPillow.rotation.z = -0.18;

  // Low oval coffee table, slender legs, and a small ceramic candle.
  rounded(scene, [1.7, 0.18, 1.03], 0.24, walnutMaterial, [0, 0.63, 0.25]);
  for (const x of [-0.68, 0.68]) {
    for (const z of [-0.34, 0.34]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.055, 0.57, 16),
        darkWoodMaterial,
      );
      leg.position.set(x, 0.31, 0.25 + z);
      leg.castShadow = true;
      scene.add(leg);
    }
  }
  const candleMaterial = new THREE.MeshStandardMaterial({ color: "#c6a077", roughness: 0.36 });
  const candle = addMesh(
    scene,
    new THREE.CylinderGeometry(0.13, 0.16, 0.32, 28),
    candleMaterial,
    [-0.26, 0.88, 0.24],
  );
  candle.castShadow = true;
  const candleTop = new THREE.Mesh(
    new THREE.CircleGeometry(0.13, 28),
    new THREE.MeshStandardMaterial({ color: "#77573e", roughness: 0.82 }),
  );
  candleTop.rotation.x = -Math.PI / 2;
  candleTop.position.set(-0.26, 1.045, 0.24);
  scene.add(candleTop);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8), darkWoodMaterial);
  wick.position.set(-0.26, 1.08, 0.24);
  scene.add(wick);

  // Floor lamp with a tapered linen shade and a warm pool of light.
  const lampX = 3.25;
  const lampZ = -1.95;
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.12, 32), metalMaterial);
  lampBase.position.set(lampX, 0.08, lampZ);
  lampBase.castShadow = true;
  scene.add(lampBase);
  const lampStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.055, 2.45, 20),
    metalMaterial,
  );
  lampStem.position.set(lampX, 1.32, lampZ);
  lampStem.castShadow = true;
  scene.add(lampStem);
  const shadeMaterial = new THREE.MeshStandardMaterial({
    color: "#e5c48e",
    roughness: 0.72,
    emissive: "#9d6735",
    emissiveIntensity: 0.16,
  });
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.47, 0.58, 36, 1, true),
    shadeMaterial,
  );
  shade.position.set(lampX, 2.77, lampZ);
  shade.castShadow = true;
  scene.add(shade);
  const lampGlow = new THREE.PointLight("#f4c985", 2.7, 5.5, 2);
  lampGlow.position.set(lampX, 2.52, lampZ);
  scene.add(lampGlow);

  // Tapered planter and soft oval leaves.
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.33, 0.25, 0.64, 32),
    new THREE.MeshStandardMaterial({ color: "#956a48", roughness: 0.66 }),
  );
  pot.position.set(3.45, 0.34, 3.35);
  pot.castShadow = true;
  scene.add(pot);
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: "#647a57",
    roughness: 0.86,
    side: THREE.DoubleSide,
  });
  const leafGeometry = new THREE.SphereGeometry(1, 20, 14);
  const leaves: [number, number, number, number][] = [
    [-0.32, 0.55, 0.1, -0.36],
    [-0.12, 0.72, -0.05, -0.12],
    [0.12, 0.68, 0.12, 0.12],
    [0.34, 0.53, -0.08, 0.36],
    [0, 0.88, -0.2, 0],
    [-0.38, 0.47, -0.22, -0.62],
    [0.37, 0.46, 0.25, 0.62],
  ];
  for (const [x, y, z, angle] of leaves) {
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.set(3.45 + x, 0.62 + y, 3.35 + z);
    leaf.scale.set(0.17, 0.66, 0.075);
    leaf.rotation.z = angle;
    leaf.rotation.y = angle * 0.8;
    leaf.castShadow = true;
    scene.add(leaf);
  }

  // Monitor speakers with inset cones.
  const speakerMaterial = new THREE.MeshStandardMaterial({ color: "#252a27", roughness: 0.74 });
  const coneMaterial = new THREE.MeshStandardMaterial({
    color: "#9b8a6e",
    roughness: 0.65,
    metalness: 0.1,
  });
  for (const x of [-3.35, 2.18]) {
    rounded(scene, [0.5, 1.12, 0.52], 0.08, speakerMaterial, [x, 0.58, -2.18]);
    const cone = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), coneMaterial);
    cone.position.set(x, 0.7, -1.905);
    scene.add(cone);
    const dustCap = new THREE.Mesh(new THREE.CircleGeometry(0.055, 24), metalMaterial);
    dustCap.position.set(x, 0.7, -1.89);
    scene.add(dustCap);
    const tweeter = new THREE.Mesh(new THREE.CircleGeometry(0.055, 24), coneMaterial);
    tweeter.position.set(x, 1.03, -1.9);
    scene.add(tweeter);
  }

  // Original abstract sound artwork; all displayed shapes are generated locally.
  const frameMaterial = new THREE.MeshStandardMaterial({ color: "#8b6a43", roughness: 0.5 });
  rounded(scene, [1.52, 1.12, 0.12], 0.055, frameMaterial, [2.78, 4.75, -4.38]);
  if (artMap) {
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(1.32, 0.92),
      new THREE.MeshStandardMaterial({ map: artMap, roughness: 0.9 }),
    );
    art.position.set(2.78, 4.75, -4.305);
    scene.add(art);
  }

  const panelRoot = new THREE.Group();
  scene.add(panelRoot);
  const buildItems: {
    group: import("three").Group;
    start: number;
    target: import("three").Vector3;
    wallRotation: number;
    outward: import("three").Vector3;
  }[] = [];
  let animationFrame = 0;
  let disposed = false;
  let currentConfig: ConfigState | null = null;
  let currentDef: ConfigDef | null = null;

  const resize = () => {
    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;
    const aspect = width / height;
    camera.aspect = aspect;
    const mobileFit = Math.max(1, 0.96 / aspect);
    camera.position.copy(cameraTarget).addScaledVector(cameraDirection, 18 * mobileFit);
    camera.lookAt(cameraTarget);
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = 14 * mobileFit;
      scene.fog.far = 32 * mobileFit;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  observer?.observe(host);
  window.addEventListener("resize", resize);
  resize();

  const addPanel = (
    wall: "rear" | "side",
    index: number,
    y: number,
    span: number,
    panelWidth: number,
    panelHeight: number,
    slatColor: string,
    feltColor: string,
    horizontal: boolean,
    start: number,
  ) => {
    const group = new THREE.Group();
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#201f1a", roughness: 0.7 });
    const feltMaterial = new THREE.MeshStandardMaterial({ color: feltColor, roughness: 0.96 });
    const slatMaterial = new THREE.MeshStandardMaterial({ color: slatColor, roughness: 0.48 });
    rounded(group, [panelWidth + 0.055, panelHeight + 0.055, 0.16], 0.035, edgeMaterial, [0, 0, 0]);
    rounded(group, [panelWidth, panelHeight, 0.17], 0.025, feltMaterial, [0, 0, 0.015]);

    const count = horizontal ? 8 : Math.max(7, Math.round(panelWidth * 6.4));
    if (horizontal) {
      const slatHeight = (panelHeight - 0.14) / count;
      for (let slat = 0; slat < count; slat += 1) {
        const mesh = rounded(
          group,
          [panelWidth - 0.14, slatHeight * 0.53, 0.085],
          0.018,
          slatMaterial,
          [0, -panelHeight / 2 + slatHeight * (slat + 0.5), 0.12],
        );
        mesh.castShadow = true;
      }
    } else {
      const slatWidth = (panelWidth - 0.14) / count;
      for (let slat = 0; slat < count; slat += 1) {
        const mesh = rounded(
          group,
          [slatWidth * 0.52, panelHeight - 0.14, 0.085],
          0.018,
          slatMaterial,
          [-panelWidth / 2 + slatWidth * (slat + 0.5), 0, 0.12],
        );
        mesh.castShadow = true;
      }
    }

    const sideWall = wall === "side";
    const target = sideWall
      ? new THREE.Vector3(-4.34, y, -span / 2 + index * (panelWidth + 0.14) + panelWidth / 2)
      : new THREE.Vector3(-span / 2 + index * (panelWidth + 0.14) + panelWidth / 2, y, -4.34);
    const outward = sideWall ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    group.position.copy(target).addScaledVector(outward, 0.42);
    group.rotation.y = sideWall ? Math.PI / 2 - 0.2 : -0.2;
    group.scale.setScalar(0.64);
    panelRoot.add(group);
    buildItems.push({ group, start, target, wallRotation: sideWall ? Math.PI / 2 : 0, outward });
  };

  const animatePanels = (now: number, reducedMotion: boolean) => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    const finish = () => {
      for (const item of buildItems) {
        item.group.position.copy(item.target);
        item.group.rotation.y = item.wallRotation;
        item.group.scale.setScalar(1);
      }
      renderer.render(scene, camera);
    };
    if (reducedMotion) {
      finish();
      return;
    }

    const tick = (time: number) => {
      if (disposed) return;
      let active = false;
      for (const item of buildItems) {
        const progress = Math.max(0, Math.min(1, (time - item.start) / 940));
        if (progress < 1) active = true;
        const eased = progress >= 1 ? 1 : 1 - Math.exp(-7 * progress) * Math.cos(10 * progress);
        item.group.position
          .copy(item.target)
          .addScaledVector(item.outward, 0.42 * (1 - Math.min(1.08, eased)));
        item.group.rotation.y =
          item.wallRotation + (1 - Math.min(1, eased)) * (item.wallRotation ? -0.2 : -0.2);
        item.group.scale.setScalar(progress >= 1 ? 1 : 0.64 + 0.36 * eased);
      }
      renderer.render(scene, camera);
      if (active) animationFrame = requestAnimationFrame(tick);
      else animationFrame = 0;
    };
    tick(now);
  };

  const update = (config: ConfigState, def: ConfigDef) => {
    currentConfig = config;
    currentDef = def;
    while (panelRoot.children.length) {
      const child = panelRoot.children[0]!;
      panelRoot.remove(child);
      disposeObject(child);
    }
    buildItems.length = 0;

    const finish = def.finishes.find((option) => option.id === config.finish) ?? def.finishes[0]!;
    const felt = def.felts.find((option) => option.id === config.felt) ?? def.felts[0]!;
    const module = def.modules.find((option) => option.id === config.module) ?? def.modules[0]!;
    const slatColor = FALLBACK_FINISH[finish.id] ?? finish.value;
    const feltColor = FALLBACK_FELT[felt.id] ?? felt.value;
    const panelWidth = 1.35 * (module.w / 5);
    const panelHeight = 1.35 * (module.h / 5.4);
    const count = Math.max(1, Math.min(4, Number(config.coverage) || 1));
    const gap = 0.14;
    const span = count * panelWidth + (count - 1) * gap;
    const showRear = config.walls === "rear" || config.walls === "both";
    const showSide = config.walls === "side" || config.walls === "both";
    const horizontal = config.layout === "horizontal";
    let index = 0;

    for (const wall of ["rear", "side"] as const) {
      if ((wall === "rear" && !showRear) || (wall === "side" && !showSide)) continue;
      for (let panel = 0; panel < count; panel += 1) {
        addPanel(
          wall,
          panel,
          1.55 + panelHeight / 2,
          span,
          panelWidth,
          panelHeight,
          slatColor,
          feltColor,
          horizontal,
          performance.now() + index * 145,
        );
        index += 1;
      }
    }
    animatePanels(performance.now(), window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  const engine: RoomEngine = {
    update(config, def) {
      if (currentConfig === config && currentDef === def) return;
      update(config, def);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      disposeObject(scene);
      woodMap?.dispose();
      artMap?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  return engine;
}

export function RoomCanvas({
  config,
  def,
  onReady,
}: {
  config: ConfigState;
  def: ConfigDef;
  onReady: (ready: boolean) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<RoomEngine | null>(null);
  const configRef = useRef(config);
  const defRef = useRef(def);
  configRef.current = config;
  defRef.current = def;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || import.meta.env.SSR) return;
    let cancelled = false;
    void import("three")
      .then((THREE) => {
        if (cancelled) return;
        if (!engineRef.current) engineRef.current = createRoomEngine(host, THREE);
        engineRef.current.update(configRef.current, defRef.current);
        onReady(true);
      })
      .catch(() => {
        if (!cancelled) onReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    config.finish,
    config.felt,
    config.layout,
    config.module,
    config.coverage,
    config.walls,
    def,
    onReady,
  ]);

  useEffect(
    () => () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    },
    [],
  );

  return <div ref={hostRef} className="room-canvas" aria-hidden="true" data-testid="room-webgl" />;
}
