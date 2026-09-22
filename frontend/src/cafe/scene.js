import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { drinkBases, flavors, visitorsAt } from "./game";

// Everything in the counter, food and animal scene is geometry, no image planes.
export function createCafeScene(host) {
  const scene = new T.Scene();
  scene.background = new T.Color("#f6eee7");
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "可拖动旋转的三维咖啡馆和配方预览",
  );
  const camera = new T.PerspectiveCamera(36, 1, 0.1, 60);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 13;
  controls.minPolarAngle = 0.22;
  controls.maxPolarAngle = 1.45;
  const geometries = new Map(),
    materials = new Map();
  let dirty = true,
    disposed = false,
    frame = 0,
    last = 0,
    current,
    food = new T.Group(),
    guests = new T.Group();
  controls.addEventListener("change", () => {
    dirty = true;
  });
  const mat = (color) => {
    if (!materials.has(color))
      materials.set(
        color,
        new T.MeshStandardMaterial({ color, roughness: 0.68 }),
      );
    return materials.get(color);
  };
  function mesh(parent, type, args, color, pos = [0, 0, 0], scale = [1, 1, 1]) {
    const key = type + JSON.stringify(args);
    if (!geometries.has(key)) geometries.set(key, new T[type](...args));
    const m = new T.Mesh(geometries.get(key), mat(color));
    m.position.set(...pos);
    m.scale.set(...scale);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  const box = (p, c, x, y, z, w, h, d) =>
    mesh(p, "BoxGeometry", [w, h, d], c, [x, y, z]);
  const ball = (p, c, x, y, z, rx, ry = rx, rz = rx) =>
    mesh(p, "SphereGeometry", [1, 24, 16], c, [x, y, z], [rx, ry, rz]);
  const cyl = (p, c, x, y, z, r, h, rt = r) =>
    mesh(p, "CylinderGeometry", [rt, r, h, 40], c, [x, y, z]);
  const ring = (p, c, x, y, z, r, t) => {
    const m = mesh(p, "TorusGeometry", [r, t, 10, 48], c, [x, y, z]);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  const cream = "#fff5df",
    pink = "#dfb0b9",
    gold = "#bca078",
    wood = "#d9b99b",
    sage = "#a9b6a0";
  scene.add(new T.HemisphereLight("#fff5e7", "#b99bac", 2.3));
  const sun = new T.DirectionalLight("#fff4d7", 3.2);
  sun.position.set(-3, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  const cafe = new T.Group();
  scene.add(cafe, food, guests);
  box(cafe, "#e1cfc0", 0, -0.12, 0, 7, 0.25, 5.3);
  box(cafe, "#f4dfd6", 0, 1.7, -2.6, 7, 3.5, 0.15);
  for (let i = -3; i <= 3; i++)
    box(cafe, "#e4c1bc", i, 1.7, -2.49, 0.025, 3.5, 0.03);
  // Window, crossbars, striped canopy and scalloped valance.
  box(cafe, cream, -1.65, 2, -2.38, 2.25, 2.25, 0.14);
  box(cafe, "#bbd5cf", -1.65, 2, -2.28, 2.04, 2.04, 0.07);
  box(cafe, cream, -1.65, 2, -2.2, 0.06, 2.1, 0.05);
  box(cafe, cream, -1.65, 2, -2.2, 2.1, 0.06, 0.05);
  box(cafe, cream, -1.65, 0.94, -2.04, 2.4, 0.1, 0.45);
  for (let i = 0; i < 12; i++) {
    box(
      cafe,
      i % 2 ? cream : pink,
      -3.22 + i * 0.585,
      3.45,
      -2.13,
      0.585,
      0.14,
      0.95,
    );
    ball(
      cafe,
      i % 2 ? cream : pink,
      -3.22 + i * 0.585,
      3.28,
      -1.68,
      0.29,
      0.2,
      0.07,
    );
  }
  box(cafe, wood, 1.55, 2.1, -2.1, 2.05, 0.1, 0.45);
  box(cafe, wood, 1.55, 2.85, -2.1, 2.05, 0.1, 0.45);
  for (let i = 0; i < 5; i++) {
    cyl(
      cafe,
      [pink, sage, cream][i % 3],
      0.8 + i * 0.37,
      2.35,
      -2.06,
      0.13,
      0.37,
    );
    cyl(cafe, gold, 0.8 + i * 0.37, 2.56, -2.06, 0.14, 0.05);
    cyl(cafe, [cream, pink, sage][i % 3], 0.8 + i * 0.37, 3, -2.05, 0.12, 0.2);
  }
  // Counter with panelled front, espresso machine and glass pastry display.
  box(cafe, pink, 0, 0.55, -0.35, 5.5, 1.1, 1.4);
  box(cafe, cream, 0, 1.14, -0.35, 5.7, 0.17, 1.55);
  for (let i = -2; i <= 2; i++) {
    box(cafe, "#ecd0d0", i, 0.55, 0.365, 0.88, 0.8, 0.035);
    box(cafe, gold, i, 0.91, 0.39, 0.65, 0.022, 0.025);
  }
  box(cafe, sage, -2.05, 1.64, -0.6, 0.82, 0.86, 0.62);
  box(cafe, cream, -2.05, 1.65, -0.25, 0.65, 0.2, 0.04);
  for (const x of [-2.25, -1.88]) {
    cyl(cafe, gold, x, 1.47, -0.21, 0.07, 0.18);
    cyl(cafe, cream, x, 1.3, -0.15, 0.12, 0.14);
  }
  box(cafe, gold, -2.05, 1.24, -0.2, 0.85, 0.05, 0.72);
  const glass = new T.MeshStandardMaterial({
    color: "#f3fff6",
    transparent: true,
    opacity: 0.2,
    roughness: 0.2,
    depthWrite: false,
  });
  materials.set("glass", glass);
  const caseMesh = box(cafe, cream, 1.85, 1.55, -0.5, 1.35, 0.7, 0.9);
  caseMesh.material = glass;
  box(cafe, gold, 1.85, 1.2, -0.5, 1.45, 0.07, 0.98);
  box(cafe, gold, 1.85, 1.92, -0.5, 1.45, 0.06, 0.98);
  for (const x of [1.22, 2.48])
    for (const z of [-0.91, -0.09])
      box(cafe, gold, x, 1.56, z, 0.025, 0.72, 0.025);
  for (let i = 0; i < 3; i++) {
    cyl(cafe, cream, 1.43 + i * 0.4, 1.34, -0.5, 0.15, 0.2);
    ball(cafe, pink, 1.43 + i * 0.4, 1.49, -0.5, 0.12, 0.06, 0.12);
    ball(cafe, "#c67481", 1.43 + i * 0.4, 1.56, -0.5, 0.05);
  }
  // Foreground round work table: food remains the focus of the camera.
  cyl(cafe, wood, 0, 0.48, 1.15, 0.16, 0.96);
  cyl(cafe, cream, 0, 0.07, 1.15, 0.62, 0.12);
  cyl(cafe, "#f7e9db", 0, 1.01, 1.15, 1.28, 0.14);
  for (const x of [-2.4, 2.4]) {
    cyl(cafe, cream, x, 0.75, 1.5, 0.6, 0.1);
    cyl(cafe, wood, x, 0.37, 1.5, 0.09, 0.7);
    cyl(cafe, pink, x, 0.35, 2.1, 0.3, 0.13);
    box(cafe, pink, x, 0.67, 2.35, 0.6, 0.58, 0.12);
  }
  // A small plant on the windowsill.
  cyl(cafe, pink, -2.45, 1.13, -2, 0.16, 0.28, 0.2);
  for (let i = 0; i < 5; i++) {
    const leaf = ball(
      cafe,
      sage,
      -2.45 + Math.sin(i * 2) * 0.15,
      1.42 + Math.cos(i) * 0.1,
      -2,
      0.08,
      0.22,
      0.055,
    );
    leaf.rotation.z = i * 0.65;
  }
  function animal(a, x) {
    const g = new T.Group();
    g.position.set(x, 0.48, 2.08);
    g.rotation.y = x < 0 ? 0.45 : -0.45;
    guests.add(g);
    ball(g, a.color, 0, 0.26, 0, 0.26, 0.32, 0.23);
    ball(g, a.color, 0, 0.67, 0, 0.31, 0.28, 0.26);
    for (const sign of [-1, 1]) {
      const xx = sign * 0.19;
      if (a.ear === "rabbit") {
        ball(g, a.color, xx, 1.02, 0, 0.095, 0.28, 0.08);
        ball(g, pink, xx, 1.04, 0.065, 0.048, 0.19, 0.015);
      } else if (a.ear === "cat" || a.ear === "fox") {
        mesh(g, "ConeGeometry", [0.14, 0.3, 3], a.color, [xx, 0.96, 0]);
      } else ball(g, a.color, xx, 0.88, 0, 0.115);
      ball(g, "#51463f", sign * 0.105, 0.71, 0.235, 0.028);
      ball(g, pink, sign * 0.17, 0.61, 0.225, 0.052, 0.026, 0.012);
      ball(g, a.color, sign * 0.25, 0.31, 0.07, 0.08, 0.17, 0.08);
      ball(g, a.color, sign * 0.14, 0.04, 0.1, 0.11, 0.09, 0.15);
    }
    ball(g, cream, 0, 0.57, 0.21, 0.13, 0.085, 0.07);
    ball(g, "#a5767b", 0, 0.61, 0.28, 0.035, 0.025, 0.02);
    box(g, pink, 0, 0.4, 0.215, 0.37, 0.07, 0.04);
    if (a.ear === "squirrel")
      ball(g, a.color, 0.31, 0.32, -0.22, 0.2, 0.4, 0.2);
    if (a.ear === "owl")
      for (const s of [-1, 1]) {
        ball(g, cream, s * 0.12, 0.71, 0.22, 0.11, 0.11, 0.035);
        ball(g, "#51463f", s * 0.12, 0.71, 0.265, 0.035);
      }
  }
  function makeFood(r, job) {
    food.clear();
    food.position.set(0, 1.105, 1.15);
    const f = flavors.find((x) => x.id === r.flavor).color;
    const stage = job ? job.step : 3;
    cyl(food, cream, 0, 0.03, 0, 0.77, 0.06);
    ring(food, gold, 0, 0.066, 0, 0.69, 0.012);
    let top = 0;
    if (r.kind === "drink") {
      cyl(food, "#f7e9d6", 0, 0.51, 0, 0.32, 0.87, 0.38);
      ring(food, gold, 0, 0.955, 0, 0.38, 0.012);
      const liquid =
        stage === 0
          ? "#eee1d1"
          : stage === 1
            ? drinkBases.find((b) => b.id === r.base).color
            : f;
      cyl(food, liquid, 0, 0.52, 0, 0.323, 0.84, 0.383);
      if (stage >= 2)
        cyl(
          food,
          drinkBases.find((b) => b.id === r.base).color,
          0,
          0.27,
          0,
          0.33,
          0.3,
          0.35,
        );
      top = 0.955;
      if (stage >= 2 || !job) {
        const straw = cyl(food, pink, 0.14, 1.12, -0.11, 0.026, 0.63);
        straw.rotation.z = -0.15;
        if (r.temperature === "冰饮")
          for (let i = 0; i < 3; i++) {
            const ice = box(
              food,
              "#d8e4dc",
              -0.15 + i * 0.14,
              1,
              0.1,
              0.12,
              0.1,
              0.12,
            );
            ice.rotation.y = i * 0.6;
          }
      }
      ring(food, cream, 0.34, 0.6, 0, 0.18, 0.04).rotation.x = 0;
      for (let i = 0; i < 6; i++)
        ball(
          food,
          "#fff1dd",
          Math.cos(i * 1.3) * 0.325,
          0.25 + i * 0.08,
          Math.sin(i * 1.3) * 0.325,
          0.024,
        );
    } else if (stage === 0) {
      cyl(food, pink, 0, 0.21, 0, 0.48, 0.28, 0.55);
      cyl(food, "#e9d8ba", 0, 0.355, 0, 0.5, 0.02);
      top = 0.37;
    } else if (r.cake === "slice") {
      const shape = new T.Shape();
      shape.moveTo(-0.5, -0.36);
      shape.lineTo(0.55, -0.36);
      shape.lineTo(0.15, 0.57);
      shape.closePath();
      for (let i = 0; i < 5; i++) {
        const key = "wedge" + i;
        if (!geometries.has(key))
          geometries.set(
            key,
            new T.ExtrudeGeometry(shape, {
              depth: 0.13,
              bevelEnabled: true,
              bevelSize: 0.025,
              bevelThickness: 0.025,
              bevelSegments: 2,
              steps: 1,
            }),
          );
        const m = new T.Mesh(
          geometries.get(key),
          mat(
            i % 2
              ? r.filling === "果酱"
                ? f
                : r.filling === "布丁"
                  ? "#ebca80"
                  : cream
              : f,
          ),
        );
        m.rotation.x = -Math.PI / 2;
        m.position.y = 0.09 + i * 0.14;
        m.castShadow = true;
        food.add(m);
      }
      top = 0.83;
    } else if (r.cake === "cupcake") {
      cyl(food, pink, 0, 0.3, 0, 0.29, 0.43, 0.43);
      for (let i = 0; i < 20; i++) {
        const a = (i * Math.PI) / 10;
        const ridge = cyl(
          food,
          cream,
          Math.cos(a) * 0.37,
          0.31,
          Math.sin(a) * 0.37,
          0.012,
          0.4,
        );
        ridge.rotation.z = Math.sin(a) * 0.25;
        ridge.rotation.x = Math.cos(a) * 0.25;
      }
      ball(food, f, 0, 0.54, 0, 0.45, 0.25, 0.45);
      top = 0.73;
    } else {
      for (let i = 0; i < 3; i++) {
        cyl(food, "#d9aa70", 0, 0.19 + i * 0.22, 0, 0.48, 0.2);
        ring(food, "#d9aa70", 0, 0.14 + i * 0.22, 0, 0.46, 0.065);
        ring(food, "#dfb681", 0, 0.25 + i * 0.22, 0, 0.46, 0.055);
        cyl(
          food,
          i === 2
            ? f
            : r.filling === "果酱"
              ? f
              : r.filling === "布丁"
                ? "#ebca80"
                : cream,
          0,
          0.29 + i * 0.22,
          0,
          0.51,
          0.035,
        );
      }
      top = 0.77;
    }
    if (stage >= 3) {
      for (const id of r.toppings) {
        if (id === "cream") {
          for (let k = 0; k < 4; k++)
            ring(
              food,
              cream,
              0,
              top + 0.04 + k * 0.07,
              0,
              0.24 - k * 0.055,
              0.055,
            );
          ball(food, cream, 0, top + 0.31, 0, 0.045, 0.08, 0.045);
        }
        if (id === "berry") {
          for (let i = 0; i < 3; i++) {
            const x = Math.cos(i * 2.1) * 0.28,
              z = Math.sin(i * 2.1) * 0.28;
            ball(food, "#d76a83", x, top + 0.09, z, 0.085, 0.12, 0.085);
            for (let j = 0; j < 3; j++)
              ball(
                food,
                sage,
                x + (j - 1) * 0.04,
                top + 0.19,
                z,
                0.05,
                0.012,
                0.024,
              );
            for (let j = 0; j < 4; j++)
              ball(
                food,
                cream,
                x + Math.sin(j * 2) * 0.065,
                top + 0.06 + (j % 2) * 0.05,
                z + 0.066,
                0.008,
              );
          }
        }
        if (id === "blueberry" || id === "pearls")
          for (let i = 0; i < 8; i++)
            ball(
              food,
              id === "blueberry" ? "#757d9e" : "#765647",
              Math.cos(i) * 0.34,
              top + 0.045,
              Math.sin(i) * 0.34,
              0.047,
            );
        if (id === "chocolate")
          for (let i = 0; i < 4; i++) {
            const stripe = box(
              food,
              "#725041",
              -0.27 + i * 0.17,
              top + 0.02,
              0,
              0.035,
              0.018,
              0.57,
            );
            stripe.rotation.y = 0.25;
          }
        if (id === "flower")
          for (let i = 0; i < 5; i++)
            ball(
              food,
              pink,
              -0.25 + Math.cos(i * 1.256) * 0.065,
              top + 0.04,
              0.12 + Math.sin(i * 1.256) * 0.065,
              0.05,
              0.025,
              0.05,
            );
      }
    }
  }
  function setView(wide = false) {
    camera.position.set(...(wide ? [7, 6.5, 10] : [3.1, 3.8, 5.6]));
    controls.target.set(0, wide ? 1.1 : 1.55, wide ? 0 : 1.05);
    controls.update();
  }
  setView();
  function update(state) {
    dirty = true;
    current = state;
    makeFood(state.job?.recipe || state.recipe, state.job);
    guests.clear();
    visitorsAt(state.minutes)
      .slice(0, 2)
      .forEach((a, i) => animal(a, i === 0 ? -2.4 : 2.4));
    const night = state.minutes % 1440 >= 1080 || state.minutes % 1440 < 480;
    sun.intensity = night ? 1.1 : 3.2;
    scene.background.set(night ? "#d9d0df" : "#f6eee7");
  }
  const resize = () => {
    dirty = true;
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function tick(now) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    if (now - last < 33) return;
    last = now;
    if (current?.job?.busy) {
      const j = current.job,
        p = Math.min(1, (Date.now() - j.startedAt) / (j.endsAt - j.startedAt));
      food.rotation.y = Math.sin(p * Math.PI * 4) * 0.12;
      food.scale.setScalar(1 + Math.sin(p * Math.PI) * 0.035);
    } else {
      food.rotation.y = 0;
      food.scale.setScalar(1);
    }
    if (
      host.clientWidth &&
      host.clientHeight &&
      (dirty || current?.job?.busy)
    ) {
      dirty = false;
      renderer.render(scene, camera);
      renderer.domElement.dataset.ready = "true";
      renderer.domElement.dataset.azimuth = controls.getAzimuthalAngle();
    }
  }
  frame = requestAnimationFrame(tick);
  return {
    update,
    setView,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
