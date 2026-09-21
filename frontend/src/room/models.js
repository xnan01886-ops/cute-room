import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Every visible object in this room is mesh geometry. No furniture billboards,
// baked room images, image textures, or externally downloaded models are used.
export function buildRoom(scene) {
  const geometries = new Map();
  const materials = new Set();
  const interactive = [];
  const named = {};
  const geo = (key, make) => {
    if (!geometries.has(key)) geometries.set(key, make());
    return geometries.get(key);
  };
  const mat = (color, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.66,
      ...extra,
    });
    materials.add(m);
    return m;
  };
  const m = {
    cream: mat("#fff2e0"),
    white: mat("#fff9ee"),
    pink: mat("#e9a1bc"),
    blush: mat("#f7cada"),
    darkPink: mat("#ba658d"),
    rose: mat("#d485a5"),
    gold: mat("#d4ae65", { metalness: 0.68, roughness: 0.3 }),
    paleGold: mat("#f1d595", { metalness: 0.38, roughness: 0.4 }),
    wood: mat("#debd9e"),
    wall: mat("#f4dce3"),
    stripe: mat("#eecbd9"),
    rug: mat("#ecc0d0", { roughness: 1 }),
    green: mat("#9cbb96"),
    mint: mat("#bad4c9"),
    blue: mat("#c0dfe7"),
    brown: mat("#695052"),
    silver: mat("#cbdce6", { metalness: 0.88, roughness: 0.14 }),
    fabric: mat("#f6d2df", { roughness: 0.95 }),
    sheer: mat("#fff1f5", {
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    black: mat("#292637"),
    lamp: mat("#ffedcc", { emissive: "#ffcf79", emissiveIntensity: 0 }),
    bulb: mat("#ffedcc", { emissive: "#ffcf79", emissiveIntensity: 0 }),
    screen: mat("#302e4e", { emissive: "#e8c7ef", emissiveIntensity: 0 }),
    window: mat("#b7dce4", { emissive: "#d0ecfa", emissiveIntensity: 0.3 }),
    wind: mat("#d3f3f8", {
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      emissive: "#9fdaeb",
      emissiveIntensity: 0.4,
    }),
  };
  const root = new THREE.Group();
  root.name = "Strawberry Cream Palace";
  scene.add(root);
  function group(parent, name, pos = [0, 0, 0], action) {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(...pos);
    parent.add(g);
    if (action) {
      g.userData.action = action;
      interactive.push(g);
      named[action] = g;
    }
    return g;
  }
  function mesh(
    parent,
    geometry,
    material,
    pos = [0, 0, 0],
    scale = [1, 1, 1],
  ) {
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(...pos);
    obj.scale.set(...scale);
    obj.castShadow = true;
    obj.receiveShadow = true;
    parent.add(obj);
    return obj;
  }
  function box(parent, size, pos, material = m.cream, radius = 0.04) {
    const key = `box:${size.join(",")}:${radius}`;
    return mesh(
      parent,
      geo(key, () =>
        radius
          ? new RoundedBoxGeometry(
              ...size,
              2,
              Math.min(radius, ...size.map((v) => v / 3)),
            )
          : new THREE.BoxGeometry(...size),
      ),
      material,
      pos,
    );
  }
  function ball(parent, pos, scale, material = m.cream) {
    return mesh(
      parent,
      geo("sphere", () => new THREE.SphereGeometry(1, 16, 12)),
      material,
      pos,
      Array.isArray(scale) ? scale : [scale, scale, scale],
    );
  }
  function cylinder(parent, pos, top, bottom, height, material = m.gold) {
    return mesh(
      parent,
      geo(
        `c:${top}:${bottom}:${height}`,
        () => new THREE.CylinderGeometry(top, bottom, height, 24),
      ),
      material,
      pos,
    );
  }
  function ring(
    parent,
    pos,
    radius,
    tube,
    material = m.gold,
    scale = [1, 1, 1],
  ) {
    return mesh(
      parent,
      geo(
        `t:${radius}:${tube}`,
        () => new THREE.TorusGeometry(radius, tube, 8, 40),
      ),
      material,
      pos,
      scale,
    );
  }
  function curve(parent, pts, radius = 0.025, material = m.gold) {
    const g = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))),
      24,
      radius,
      6,
      false,
    );
    geometries.set(g.uuid, g);
    return mesh(parent, g, material);
  }
  function shape(parent, path, depth, material, pos = [0, 0, 0]) {
    const g = new THREE.ExtrudeGeometry(path, {
      depth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
      curveSegments: 20,
    });
    geometries.set(g.uuid, g);
    return mesh(parent, g, material, pos);
  }
  function heart(parent, pos, size, material = m.pink) {
    const s = new THREE.Shape();
    s.moveTo(0, -0.65);
    s.bezierCurveTo(-1, 0.1, -0.8, 0.9, 0, 0.35);
    s.bezierCurveTo(0.8, 0.9, 1, 0.1, 0, -0.65);
    return shape(parent, s, 0.1, material, pos).scale.setScalar(size);
  }
  function bow(parent, pos, s = 0.3, material = m.pink) {
    const g = group(parent, "Sculpted ribbon", pos);
    g.scale.setScalar(s);
    const a = ball(g, [-0.62, 0, 0], [0.65, 0.35, 0.17], material);
    a.rotation.z = -0.35;
    const b = ball(g, [0.62, 0, 0], [0.65, 0.35, 0.17], material);
    b.rotation.z = 0.35;
    ball(g, [0, 0, 0.12], [0.22, 0.22, 0.22], material);
    const l = box(g, [0.28, 0.85, 0.08], [-0.27, -0.56, -0.02], material);
    l.rotation.z = -0.35;
    const r = box(g, [0.28, 0.85, 0.08], [0.27, -0.56, -0.02], material);
    r.rotation.z = 0.35;
    return g;
  }
  function crown(parent, pos, s = 1) {
    const g = group(parent, "Little gold crown", pos);
    g.scale.setScalar(s);
    const path = new THREE.Shape();
    path.moveTo(-0.48, 0);
    path.lineTo(-0.55, 0.42);
    path.lineTo(-0.22, 0.22);
    path.lineTo(0, 0.6);
    path.lineTo(0.22, 0.22);
    path.lineTo(0.55, 0.42);
    path.lineTo(0.48, 0);
    path.closePath();
    shape(g, path, 0.08, m.gold);
    [-0.54, 0, 0.54].forEach((x, i) =>
      ball(g, [x, i === 1 ? 0.6 : 0.42, 0.04], 0.055, m.paleGold),
    );
    box(g, [0.97, 0.09, 0.14], [0, 0.01, 0.04], m.paleGold, 0.02);
    return g;
  }
  function feet(parent, xs, zs, height = 0.28) {
    xs.forEach((x) =>
      zs.forEach((z) => {
        cylinder(parent, [x, height / 2, z], 0.045, 0.07, height, m.gold);
        ball(parent, [x, 0.06, z], 0.07, m.paleGold);
      }),
    );
  }
  function bunny(parent, pos, s = 0.4) {
    const g = group(parent, "Velvet rabbit", pos);
    g.scale.setScalar(s);
    ball(g, [0, 0.45, 0], [0.42, 0.5, 0.32], m.white);
    ball(g, [0, 1.02, 0], [0.49, 0.44, 0.37], m.white);
    [-1, 1].forEach((sign) => {
      const ear = ball(
        g,
        [sign * 0.23, 1.57, -0.02],
        [0.12, 0.46, 0.11],
        m.white,
      );
      ear.rotation.z = sign * -0.16;
      ball(g, [sign * 0.23, 1.58, 0.075], [0.06, 0.3, 0.028], m.blush);
      ball(g, [sign * 0.17, 1.06, 0.35], 0.035, m.brown);
      ball(g, [sign * 0.31, 0.94, 0.3], [0.08, 0.04, 0.03], m.pink);
      ball(g, [sign * 0.25, 0.11, 0.15], [0.25, 0.14, 0.28], m.white);
    });
    ball(g, [0, 0.95, 0.37], [0.047, 0.035, 0.035], m.rose);
    bow(g, [0, 0.63, 0.3], 0.25);
    return g;
  }
  function flower(parent, pos, s = 0.12, color = m.pink) {
    const g = group(parent, "Sculpted flower", pos);
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ball(
        g,
        [Math.cos(a) * s * 0.65, Math.sin(a) * s * 0.65, 0],
        [s * 0.6, s * 0.6, s * 0.3],
        color,
      );
    }
    ball(g, [0, 0, s * 0.22], s * 0.35, m.paleGold);
    return g;
  }
  function books(parent, pos, count = 4) {
    const g = group(parent, "Books", pos);
    for (let i = 0; i < count; i++) {
      const h = 0.35 + (i % 3) * 0.06;
      box(
        g,
        [0.105, h, 0.25],
        [i * 0.12, h / 2, 0],
        [m.pink, m.cream, m.mint, m.blue][i % 4],
        0.012,
      );
      box(g, [0.09, 0.018, 0.012], [i * 0.12, h * 0.7, 0.133], m.gold, 0.002);
    }
    return g;
  }
  function vase(parent, pos, s = 0.3) {
    const g = group(parent, "Rose bouquet", pos);
    g.scale.setScalar(s);
    ball(g, [0, 0.4, 0], [0.38, 0.47, 0.38], m.cream);
    cylinder(g, [0, 0.75, 0], 0.18, 0.27, 0.35, m.cream);
    for (let i = 0; i < 5; i++) {
      const a = i * 2.4,
        x = Math.cos(a) * 0.36,
        z = Math.sin(a) * 0.28;
      curve(
        g,
        [
          [0, 0.8, 0],
          [x * 0.6, 1.15, z * 0.6],
          [x, 1.55, z],
        ],
        0.023,
        m.green,
      );
      flower(g, [x, 1.55, z], 0.22, i % 2 ? m.blush : m.rose);
    }
    return g;
  }

  // Solid beveled plinth and individual wood planks.
  box(root, [10.25, 0.26, 8.2], [0, -0.15, 0], m.rose, 0.12);
  box(root, [10.12, 0.12, 8.1], [0, 0.015, 0], m.paleGold, 0.06);
  const floorMats = ["#f6e7d1", "#efdfc6", "#f9ecda", "#f1dfcb"].map((c) =>
    mat(c),
  );
  for (let row = 0; row < 12; row++)
    for (let col = 0; col < 6; col++)
      box(
        root,
        [1.64, 0.07, 0.654],
        [-4.15 + col * 1.66, 0.11, -3.62 + row * 0.66],
        floorMats[(row * 7 + col) % 4],
        0.006,
      );
  const back = group(root, "Back wall"),
    left = group(root, "Left wall");
  function wall(parent, width) {
    box(parent, [width, 3.55, 0.15], [0, 1.8, 0], m.wall, 0.015);
    for (let i = 0; i < width / 0.45; i++)
      box(
        parent,
        [0.11, 2.17, 0.012],
        [-width / 2 + 0.14 + i * 0.45, 2.12, 0.09],
        m.stripe,
        0.002,
      );
    for (let i = 0; i < width / 1.0; i++) {
      const x = -width / 2 + 0.5 + i;
      box(parent, [0.86, 0.82, 0.055], [x, 0.65, 0.1], m.cream, 0.025);
      box(parent, [0.74, 0.68, 0.06], [x, 0.65, 0.14], m.paleGold, 0.018);
      box(parent, [0.7, 0.64, 0.065], [x, 0.65, 0.18], m.wall, 0.018);
    }
    [0.22, 1.14, 3.35, 3.53].forEach((y, i) =>
      box(
        parent,
        [width + 0.09, i === 2 ? 0.12 : 0.06, 0.23],
        [0, y, 0.015],
        i % 2 ? m.gold : m.cream,
        0.018,
      ),
    );
    [-width / 2 + 0.09, width / 2 - 0.09].forEach((x) => {
      box(parent, [0.2, 3.5, 0.23], [x, 1.8, 0.03], m.cream);
      box(parent, [0.28, 0.16, 0.28], [x, 3.38, 0.05], m.paleGold);
    });
  }
  wall(back, 10);
  back.position.z = -4;
  wall(left, 8);
  left.position.set(-5, 0, 0);
  left.rotation.y = Math.PI / 2;

  // Arched window, multiple frame pieces, actual pleated curtain meshes.
  const windowGroup = group(left, "Arched window", [0.9, 1.35, 0.15]);
  const arch = new THREE.Shape();
  arch.moveTo(-0.93, 0);
  arch.lineTo(-0.93, 1.13);
  arch.absarc(0, 1.13, 0.93, Math.PI, 0, true);
  arch.lineTo(0.93, 0);
  arch.closePath();
  shape(windowGroup, arch, 0.035, m.window, [0, 0, 0.02]);
  curve(
    windowGroup,
    [
      [-0.97, 0, 0.09],
      [-0.97, 1.1, 0.09],
      [-0.7, 1.8, 0.09],
      [0, 2.09, 0.09],
      [0.7, 1.8, 0.09],
      [0.97, 1.1, 0.09],
      [0.97, 0, 0.09],
    ],
    0.07,
    m.cream,
  );
  box(windowGroup, [2.13, 0.12, 0.4], [0, -0.04, 0.11], m.white);
  box(windowGroup, [0.055, 1.98, 0.07], [0, 1, 0.12], m.gold, 0.01);
  box(windowGroup, [1.88, 0.055, 0.07], [0, 0.85, 0.12], m.cream, 0.01);
  function curtain(parent, width, height, pos, material = m.fabric) {
    const g = new THREE.PlaneGeometry(width, height, 20, 24);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i);
      p.setZ(i, Math.cos((x / width) * Math.PI * 12) * 0.055);
      p.setX(i, x * (0.74 + 0.26 * Math.pow((y + height / 2) / height, 2)));
    }
    g.computeVertexNormals();
    geometries.set(g.uuid, g);
    const fabric = material.clone();
    fabric.side = THREE.DoubleSide;
    materials.add(fabric);
    const obj = mesh(parent, g, fabric, pos);
    return obj;
  }
  const curtains = [
    curtain(windowGroup, 0.65, 2.25, [-1.02, 0.9, 0.25]),
    curtain(windowGroup, 0.65, 2.25, [1.02, 0.9, 0.25]),
  ];
  [-1, 1].forEach((sign) =>
    bow(windowGroup, [sign * 0.95, 0.7, 0.34], 0.16, m.gold),
  );
  curve(
    windowGroup,
    [
      [-1.42, 2.11, 0.25],
      [0, 2.17, 0.25],
      [1.42, 2.11, 0.25],
    ],
    0.04,
    m.gold,
  );
  const sunOrb = ball(
    windowGroup,
    [0.5, 1.25, -0.01],
    0.2,
    mat("#fff6cd", { emissive: "#ffe1a0", emissiveIntensity: 0.8 }),
  );

  // Canopy bed: upholstery, quilt, pillows, crown, four turned posts and drapes.
  const bed = group(root, "Royal canopy bed", [-2.95, 0, -1.8], "bed");
  feet(bed, [-1.03, 1.03], [-1.3, 1.3]);
  box(bed, [2.4, 0.32, 3.13], [0, 0.4, 0], m.cream, 0.1);
  box(bed, [2.34, 0.04, 3.08], [0, 0.6, 0], m.gold, 0.015);
  box(bed, [2.28, 0.29, 3], [0, 0.74, 0], m.white, 0.13);
  const quilt = box(bed, [2.31, 0.19, 2.04], [0, 0.94, 0.48], m.pink, 0.09);
  for (let x = -0.95; x <= 1; x += 0.38)
    for (let z = -0.2; z < 1.5; z += 0.4)
      ball(bed, [x, 1.041, z], [0.025, 0.012, 0.025], m.paleGold);
  box(bed, [2.36, 0.12, 0.27], [0, 1.04, -0.48], m.blush, 0.04);
  [-0.58, 0.58].forEach((x) => {
    const p = box(bed, [0.92, 0.22, 0.63], [x, 1.01, -1.02], m.fabric, 0.12);
    p.rotation.x = -0.17;
    bow(bed, [x, 1.11, -0.77], 0.15, m.cream);
  });
  box(bed, [2.52, 1.18, 0.17], [0, 1.01, -1.57], m.cream, 0.14);
  const head = ball(bed, [0, 1.5, -1.56], [1.19, 0.62, 0.12], m.paleGold);
  ball(bed, [0, 1.5, -1.4], [1.11, 0.55, 0.11], m.blush);
  for (let i = -3; i <= 3; i++)
    ball(bed, [i * 0.27, 1.45, -1.28], 0.027, m.gold);
  crown(bed, [0, 1.99, -1.49], 0.63);
  for (const x of [-1.2, 1.2])
    for (const z of [-1.53, 1.53]) {
      cylinder(bed, [x, 1.85, z], 0.034, 0.05, 3.12, m.cream);
      [0.4, 1.05, 2.7, 3.3].forEach((y) => ball(bed, [x, y, z], 0.067, m.gold));
      ball(bed, [x, 3.48, z], [0.085, 0.14, 0.085], m.paleGold);
    }
  box(bed, [2.49, 0.09, 3.15], [0, 3.29, 0], m.cream, 0.04);
  // Raised open canopy roof frame, with a solid scalloped pelmet (not an image).
  box(bed, [2.2, 0.075, 2.85], [0, 3.35, 0], m.blush, 0.035);
  for (let i = 0; i < 12; i++)
    ball(bed, [-1.1 + i * 0.2, 3.19, 1.57], [0.13, 0.15, 0.06], m.blush);
  bow(bed, [0, 3.3, 1.65], 0.3, m.pink);
  const canopy = [];
  [-1, 1].forEach((sign) => {
    const c = curtain(bed, 0.5, 2.27, [sign * 1.02, 2.05, 1.51], m.sheer);
    canopy.push(c);
    bow(bed, [sign * 1.12, 1.52, 1.6], 0.14, m.gold);
  });
  bunny(bed, [0.3, 1.07, 0.13], 0.35);

  // Night stand and real local point light.
  const nightstand = group(root, "Bedside lamp", [-1.32, 0, -2.2], "lamp");
  feet(nightstand, [-0.25, 0.25], [-0.24, 0.24], 0.23);
  box(nightstand, [0.69, 0.46, 0.63], [0, 0.5, 0], m.cream, 0.05);
  box(nightstand, [0.73, 0.055, 0.66], [0, 0.77, 0], m.gold, 0.018);
  box(nightstand, [0.58, 0.32, 0.04], [0, 0.51, 0.34], m.blush, 0.025);
  ball(nightstand, [0, 0.51, 0.39], 0.035, m.gold);
  cylinder(nightstand, [0, 0.83, 0], 0.17, 0.21, 0.05);
  cylinder(nightstand, [0, 1.08, 0], 0.027, 0.04, 0.49);
  cylinder(nightstand, [0, 1.34, 0], 0.19, 0.34, 0.38, m.lamp);
  ball(nightstand, [0, 1.57, 0], 0.05, m.gold);
  const bedsideLight = new THREE.PointLight("#ffd89c", 0, 6, 2);
  bedsideLight.position.set(0, 1.4, 0.1);
  nightstand.add(bedsideLight);

  const wardrobe = group(root, "Crowned wardrobe", [0.4, 0, -3.36], "wardrobe");
  feet(wardrobe, [-0.7, 0.7], [-0.26, 0.26]);
  // Hollow cabinet: open doors reveal the shelves instead of a solid block.
  box(wardrobe, [1.86, 2.52, 0.09], [0, 1.5, -.35], m.rose, .035);
  [-.88, .88].forEach(x => box(wardrobe, [.1, 2.52, .78], [x, 1.5, 0], m.rose, .035));
  box(wardrobe, [1.8, .12, .78], [0, .29, 0], m.cream, .025);
  box(wardrobe, [.6, .17, .39], [-.42, .44, .04], m.fabric, .04);
  box(wardrobe, [.6, .15, .39], [-.42, .60, .04], m.blush, .04);
  bunny(wardrobe, [.36, .36, .09], .33);
  box(wardrobe, [1.98, 0.15, 0.87], [0, 2.79, 0], m.cream, 0.035);
  box(wardrobe, [1.97, 0.04, 0.88], [0, 2.68, 0], m.gold, 0.01);
  crown(wardrobe, [0, 2.86, 0], 0.6);
  const doors = [];
  [-1, 1].forEach((sign) => {
    const hinge = group(wardrobe, "Hinged wardrobe door", [
      sign * 0.86,
      1.48,
      0.45,
    ]);
    doors.push(hinge);
    box(hinge, [0.83, 2.31, 0.09], [-sign * 0.414, 0, 0], m.blush, 0.035);
    box(hinge, [0.69, 2.12, 0.025], [-sign * 0.414, 0, 0.06], m.gold, 0.055);
    box(hinge, [0.64, 2.07, 0.03], [-sign * 0.414, 0, 0.081], m.pink, 0.05);
    ball(hinge, [-sign * 0.73, -0.1, 0.17], 0.053, m.gold);
    bow(hinge, [-sign * 0.414, 0.66, 0.15], 0.18, m.cream);
  });
  box(wardrobe, [1.61, 0.08, 0.59], [0, 1.56, 0.05], m.cream, 0.01);
  books(wardrobe, [-0.45, 1.6, 0.12], 5);

  const vanity = group(root, "Rose vanity", [3.32, 0, -3.02], "vanity");
  feet(vanity, [-0.74, 0.74], [-0.24, 0.24], 0.93);
  box(vanity, [1.8, 0.18, 0.82], [0, 1.02, 0], m.cream, 0.08);
  box(vanity, [1.83, 0.055, 0.85], [0, 1.12, 0], m.gold, 0.02);
  box(vanity, [1.73, 0.08, 0.79], [0, 1.18, 0], m.white, 0.03);
  const mirror = ring(
    vanity,
    [0, 2.05, -0.23],
    0.58,
    0.053,
    m.gold,
    [1, 1.25, 1],
  );
  ball(vanity, [0, 2.05, -0.25], [0.55, 0.69, 0.038], m.silver);
  bow(vanity, [0, 2.79, -0.18], 0.23, m.pink);
  [-0.48, 0.48].forEach((x) => {
    box(vanity, [0.69, 0.24, 0.14], [x, 0.94, 0.42], m.blush, 0.04);
    ball(vanity, [x, 0.95, 0.52], 0.035, m.gold);
  });
  const perfume = group(vanity, "Perfume bottles", [0.51, 1.24, 0.14]);
  box(perfume, [0.14, 0.21, 0.12], [0, 0.1, 0], m.pink, 0.025);
  cylinder(perfume, [0, 0.25, 0], 0.04, 0.04, 0.08, m.gold);
  vase(vanity, [-0.6, 1.23, -0.05], 0.21);
  const stool = group(root, "Vanity stool", [3.15, 0, -1.78]);
  feet(stool, [-0.26, 0.26], [-0.2, 0.2], 0.48);
  box(stool, [0.76, 0.2, 0.63], [0, 0.59, 0], m.blush, 0.09);
  box(stool, [0.67, 0.035, 0.57], [0, 0.47, 0], m.gold);
  bunny(stool, [0, 0.7, 0], 0.24);

  // Air conditioner mounted onto the left wall; hinged louvers + modeled airflow.
  const ac = group(root, "Air conditioner", [-4.74, 2.89, 1.75], "ac");
  ac.rotation.y = Math.PI / 2;
  box(ac, [1.72, 0.43, 0.34], [0, 0, 0], m.white, 0.08);
  box(ac, [1.48, 0.06, 0.02], [0, -0.13, 0.18], m.brown, 0.01);
  const louver = box(ac, [1.43, 0.08, 0.12], [0, -0.15, 0.23], m.cream, 0.01);
  const acLed = ball(ac, [0.63, -0.04, 0.181], [0.027, 0.027, 0.009], mat("#bad4c9"));
  const airflow = group(ac, "Cool air mesh");
  for (let i = 0; i < 5; i++)
    curve(
      airflow,
      [
        [-0.55 + i * 0.27, -0.23, 0.2],
        [-0.55 + i * 0.27, -0.42, 0.45],
        [-0.58 + i * 0.27, -0.64, 0.59],
        [-0.51 + i * 0.27, -0.91, 0.7],
      ],
      0.012,
      m.wind,
    );

  // Television is a modeled cabinet, frame and lit geometric screen decoration.
  const tv = group(root, "Television", [-4.2, 0, 2.55], "tv");
  tv.rotation.y = Math.PI / 2;
  feet(tv, [-0.8, 0.8], [-0.2, 0.2], 0.24);
  box(tv, [2.09, 0.51, 0.59], [0, 0.51, 0], m.blush, 0.06);
  [-0.68, 0, 0.68].forEach((x) => {
    box(tv, [0.58, 0.33, 0.04], [x, 0.5, 0.31], m.cream, 0.035);
    ball(tv, [x, 0.52, 0.35], 0.025, m.gold);
  });
  box(tv, [2.2, 0.06, 0.65], [0, 0.79, 0], m.white, 0.03);
  box(tv, [0.62, 0.07, 0.29], [0, 0.85, 0], m.gold);
  box(tv, [1.66, 1.02, 0.1], [0, 1.43, -0.04], m.gold, 0.05);
  box(tv, [1.54, 0.9, 0.06], [0, 1.43, 0.03], m.screen, 0.035);
  const tvStars = group(tv, "Screen geometry", [0, 1.42, 0.078]);
  const tvHeart = heart(tvStars, [0, 0.03, 0], 0.32, m.blush);
  for (let i = 0; i < 5; i++)
    ball(
      tvStars,
      [-0.58 + i * 0.28, Math.sin(i * 2) * 0.28, 0.01],
      0.02,
      m.paleGold,
    );

  // Flower rug is a solid extruded, scalloped object.
  const rugPath = new THREE.Shape();
  for (let i = 0; i <= 160; i++) {
    const a = (i / 160) * Math.PI * 2,
      r = 1.72 + 0.12 * Math.cos(a * 12),
      x = Math.cos(a) * r * 1.37,
      y = Math.sin(a) * r;
    i ? rugPath.lineTo(x, y) : rugPath.moveTo(x, y);
  }
  const rug = shape(root, rugPath, 0.025, m.rug, [0.35, 0.185, 1.12]);
  rug.rotation.x = -Math.PI / 2;
  const rugBorder = ring(
    root,
    [0.35, 0.222, 1.12],
    1.65,
    0.025,
    m.cream,
    [1.37, 1, 1],
  );
  rugBorder.rotation.x = -Math.PI / 2;
  const sofa = group(root, "Ribbon sofa", [0.78, 0, 2.65], "sofa");
  feet(sofa, [-1.16, 1.16], [-0.32, 0.32]);
  box(sofa, [2.91, 0.27, 1.0], [0, 0.48, 0], m.cream, 0.13);
  box(sofa, [2.76, 0.66, 0.24], [0, 0.97, 0.43], m.blush, 0.12);
  for (const x of [-0.8, 0, 0.8]) {
    box(sofa, [0.75, 0.22, 0.71], [x, 0.69, -0.03], m.fabric, 0.1);
    box(sofa, [0.72, 0.49, 0.19], [x, 1, 0.23], m.fabric, 0.09);
    ball(sofa, [x, 1, 0.11], 0.026, m.gold);
  }
  [-1.4, 1.4].forEach((x) =>
    box(sofa, [0.27, 0.43, 1.0], [x, 0.79, 0], m.cream, 0.13),
  );
  const cushion = box(
    sofa,
    [0.46, 0.47, 0.22],
    [-0.82, 1, -0.14],
    m.pink,
    0.13,
  );
  cushion.rotation.z = 0.24;
  bow(sofa, [-0.82, 1.02, 0], 0.16, m.white);
  bunny(sofa, [0.78, 0.8, -0.09], 0.36);
  const table = group(root, "Afternoon tea", [0.35, 0, 0.9], "tea");
  feet(table, [-0.48, 0.48], [-0.27, 0.27], 0.54);
  const top = cylinder(table, [0, 0.62, 0], 0.81, 0.81, 0.1, m.cream);
  top.scale.z = 0.73;
  const trim = cylinder(table, [0, 0.57, 0], 0.8, 0.8, 0.045, m.gold);
  trim.scale.z = 0.73;
  vase(table, [-0.39, 0.68, 0], 0.23);
  const cake = cylinder(table, [0.25, 0.78, 0], 0.21, 0.21, 0.19, m.blush);
  cylinder(table, [0.25, 0.89, 0], 0.213, 0.213, 0.035, m.white);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.256;
    ball(
      table,
      [0.25 + Math.cos(a) * 0.135, 0.94, Math.sin(a) * 0.135],
      [0.045, 0.066, 0.044],
      m.rose,
    );
  }
  for (let i = 0; i < 2; i++) {
    const x = -0.05 + i * 0.46,
      z = 0.34;
    cylinder(table, [x, 0.7, z], 0.12, 0.12, 0.016, m.gold);
    cylinder(table, [x, 0.76, z], 0.07, 0.05, 0.12, m.cream);
    const r = ring(table, [x + 0.085, 0.77, z], 0.047, 0.012, m.gold);
    r.rotation.y = Math.PI / 2;
  }
  box(table, [0.3, 0.045, 0.37], [-0.4, 0.71, 0.3], m.mint, 0.015);

  const shelf = group(root, "Patisserie cabinet", [3.83, 0, 0.8], "shelf");
  feet(shelf, [-0.45, 0.45], [-0.23, 0.23], 0.28);
  box(shelf, [1.25, 0.81, 0.69], [0, 0.64, 0], m.cream, 0.06);
  box(shelf, [1.32, 0.06, 0.74], [0, 1.08, 0], m.gold, 0.02);
  [-0.3, 0.3].forEach((x) => {
    box(shelf, [0.52, 0.59, 0.06], [x, 0.66, 0.36], m.blush, 0.035);
    ball(shelf, [x, 0.68, 0.41], 0.026, m.gold);
  });
  for (const x of [-0.6, 0.6])
    cylinder(shelf, [x, 1.73, -0.27], 0.026, 0.026, 1.4, m.gold);
  [1.53, 2.07, 2.5].forEach((y) =>
    box(shelf, [1.29, 0.055, 0.48], [0, y, -0.05], m.cream, 0.025),
  );
  books(shelf, [-0.46, 1.56, -0.05], 5);
  vase(shelf, [0.24, 2.54, -0.05], 0.26);
  for (let i = 0; i < 3; i++)
    cylinder(
      shelf,
      [-0.39 + i * 0.36, 2.19, -0.02],
      0.12,
      0.12,
      0.2,
      [m.pink, m.mint, m.blue][i],
    );
  cylinder(shelf, [0, 1.22, 0], 0.28, 0.28, 0.18, m.blush);
  cylinder(shelf, [0, 1.325, 0], 0.3, 0.3, 0.035, m.white);
  bow(shelf, [0, 1.25, 0.28], 0.13, m.rose);

  const fan = group(root, "Standing fan", [-1.35, 0, 1.17], "fan");
  cylinder(fan, [0, 0.21, 0], 0.3, 0.35, 0.08, m.cream);
  cylinder(fan, [0, 0.76, 0], 0.035, 0.05, 1.12, m.gold);
  const fanHead = group(fan, "Fan head", [0, 1.45, 0]);
  ring(fanHead, [0, 0, 0], 0.36, 0.025, m.gold);
  ring(fanHead, [0, 0, 0.1], 0.34, 0.016, m.rose);
  const blades = group(fanHead, "Rotating blades", [0, 0, 0.035]);
  for (let i = 0; i < 3; i++) {
    const pivot = group(blades, "Blade");
    pivot.rotation.z = (i * Math.PI * 2) / 3;
    const b = ball(pivot, [0, 0.17, 0], [0.115, 0.2, 0.018], m.blush);
    b.rotation.z = 0.4;
  }
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    curve(
      fanHead,
      [
        [0, 0, 0.13],
        [Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.135],
        [Math.cos(a) * 0.34, Math.sin(a) * 0.34, 0.1],
      ],
      0.008,
      m.gold,
    );
  }
  ball(fanHead, [0, 0, 0.16], 0.055, m.gold);

  const plant = group(root, "Rose topiary", [3.96, 0, 3.16], "plant");
  cylinder(plant, [0, 0.39, 0], 0.32, 0.24, 0.51, m.cream);
  ring(plant, [0, 0.63, 0], 0.3, 0.025, m.gold).rotation.x = Math.PI / 2;
  cylinder(plant, [0, 1.03, 0], 0.025, 0.045, 0.83, m.wood);
  ball(plant, [0, 1.62, 0], [0.49, 0.51, 0.44], m.green);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4;
    flower(
      plant,
      [Math.cos(a) * 0.34, 1.62 + Math.sin(a) * 0.34, 0.32],
      0.11,
      i % 2 ? m.blush : m.cream,
    );
  }

  // Multi-arm chandelier: tubes, chains, crystal drops, bulbs and a real light.
  const chandelier = group(
    root,
    "Crystal chandelier",
    [0.15, 3.0, -0.15],
    "chandelier",
  );
  cylinder(chandelier, [0, 0.43, 0], 0.018, 0.018, 0.85, m.gold);
  ball(chandelier, [0, 0.03, 0], [0.1, 0.16, 0.1], m.gold);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3,
      x = Math.cos(a) * 0.64,
      z = Math.sin(a) * 0.64;
    curve(
      chandelier,
      [
        [0, 0, 0],
        [x * 0.4, -0.14, z * 0.4],
        [x, -0.11, z],
        [x, 0.13, z],
      ],
      0.021,
      m.gold,
    );
    cylinder(chandelier, [x, 0.14, z], 0.1, 0.07, 0.06, m.gold);
    ball(chandelier, [x, 0.25, z], [0.055, 0.115, 0.055], m.bulb);
    for (let j = 0; j < 3; j++) {
      const s = (j + 1) / 4;
      ball(
        chandelier,
        [x * s, -0.16 - 0.12 * Math.sin(s * Math.PI), z * s],
        0.03,
        m.paleGold,
      );
    }
    const crystal = mesh(
      chandelier,
      geo("crystal", () => new THREE.OctahedronGeometry(0.09)),
      m.silver,
      [x, -0.25, z],
      [0.6, 1.6, 0.6],
    );
  }
  const ceilingLight = new THREE.PointLight("#ffe1bc", 0, 13, 2);
  ceilingLight.position.set(0, -0.1, 0);
  chandelier.add(ceilingLight);
  // Decorative alcove on the back wall, with actual gold frame and miniature sculpture.
  const picture = group(back, "Royal wall medallion", [-0.07, 2.65, 0.15]);
  ring(picture, [0, 0, 0.02], 0.35, 0.027, m.gold, [1, 1.13, 1]);
  ball(picture, [0, 0, 0], [0.32, 0.36, 0.025], m.cream);
  heart(picture, [0, 0, 0.04], 0.24, m.pink);

  return {
    root,
    back,
    left,
    interactive,
    named,
    doors,
    curtains,
    canopy,
    bedsideLight,
    ceilingLight,
    airflow,
    louver,
    acLed,
    blades,
    tvStars,
    tvHeart,
    sunOrb,
    quilt,
    materials: m,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((mat) => mat.dispose());
      root.removeFromParent();
    },
  };
}
