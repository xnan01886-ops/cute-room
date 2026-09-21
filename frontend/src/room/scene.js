import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { buildRoom } from "./models";

export function createRoom(
  host,
  { settings, onAction, onTime, onError, onView },
) {
  let disposed = false,
    frame = 0,
    lastFrame = 0,
    lastClock = 0,
    active = true,
    current = { ...settings };
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f8ece8");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.91;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute(
    "aria-label",
    "可旋转的三维公主房：方向键旋转，加减键缩放，Home 归位",
  );
  canvas.setAttribute("role", "img");
  host.appendChild(canvas);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.target.set(0, 1.3, 0);
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.minDistance = 8;
  controls.maxDistance = 44;
  controls.maxTargetRadius = 3;
  controls.cursor.set(0, 1.3, 0);
  controls.panSpeed = 0.65;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.7;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  const envScene = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(envScene, 0.06);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.55;
  envScene.dispose();
  pmrem.dispose();
  const model = buildRoom(scene);
  const hemisphere = new THREE.HemisphereLight("#fff5ef", "#b2a5bb", 2.4);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight("#fff0d2", 3.1);
  sun.position.set(-6, 10, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -8,
    right: 8,
    top: 8,
    bottom: -8,
    near: 0.5,
    far: 35,
  });
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0003;
  sun.shadow.radius = 3;
  sun.target.position.set(0, 0, 0);
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight("#ffdfec", 0.6);
  fill.position.set(5, 6, 8);
  scene.add(fill);
  const groundGeo = new THREE.CircleGeometry(18, 64),
    groundMat = new THREE.ShadowMaterial({
      color: "#a98092",
      opacity: .14,
    });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.32;
  ground.receiveShadow = true;
  scene.add(ground);
  let initialDistance = 20,
    resizeTimer;
  const cameraDirection = new THREE.Vector3(11, 8.8, 13).normalize();
  function fit() {
    const aspect = host.clientWidth / Math.max(host.clientHeight, 1);
    const v = THREE.MathUtils.degToRad(camera.fov / 2);
    initialDistance =
      (aspect < 1 ? 7.15 : 6.05) / Math.sin(Math.min(v, Math.atan(Math.tan(v) * aspect)));
    initialDistance = Math.min(initialDistance, 40);
    controls.target.set(0, 1.1, 0);
    camera.position
      .copy(cameraDirection)
      .multiplyScalar(initialDistance)
      .add(controls.target);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.update();
  }
  function resize() {
    if (disposed) return;
    const w = Math.max(1, host.clientWidth),
      h = Math.max(1, host.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  const observer = new ResizeObserver(() => {
    resize();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!disposed && !current.view) fit();
    }, 80);
  });
  observer.observe(host);
  resize();
  fit();
  if (current.view) {
    camera.position.fromArray(current.view.position);
    controls.target.fromArray(current.view.target);
    controls.update();
  }
  const saveView = () => {
    if (disposed) return;
    const view = {
      position: camera.position.toArray(),
      target: controls.target.toArray(),
    };
    current.view = view;
    onView(view);
  };
  controls.addEventListener("end", saveView);
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  let start = null;
  const fingers = new Set();
  let pinch = false;
  function down(e) {
    fingers.add(e.pointerId);
    if (fingers.size > 1) pinch = true;
    start = {
      x: e.clientX,
      y: e.clientY,
      id: e.pointerId,
      time: performance.now(),
    };
  }
  function up(e) {
    fingers.delete(e.pointerId);
    if (!start || pinch || start.id !== e.pointerId) {
      if (!fingers.size) pinch = false;
      return;
    }
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    start = null;
    if (moved > 7) return;
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    // First visible surface wins: clicking a wall must never toggle furniture behind it.
    const hits = ray.intersectObject(model.root, true).filter((hit) => {
      let p = hit.object;
      while (p) {
        if (!p.visible) return false;
        p = p.parent;
      }
      return true;
    });
    if (hits.length) {
      let object = hits[0].object;
      while (object && !object.userData.action) object = object.parent;
      if (object) onAction(object.userData.action);
    }
  }
  function cancel(e) {
    fingers.delete(e.pointerId);
    start = null;
    if (!fingers.size) pinch = false;
  }
  function orbit(angle) {
    const offset = camera.position.clone().sub(controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    saveView();
  }
  function zoom(factor) {
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(
      THREE.MathUtils.clamp(
        offset.length() * factor,
        controls.minDistance,
        controls.maxDistance,
      ),
    );
    camera.position.copy(controls.target).add(offset);
    controls.update();
    saveView();
  }
  function key(e) {
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "+",
        "=",
        "-",
        "Home",
      ].includes(e.key)
    ) {
      e.preventDefault();
      if (e.key === "Home") {
        fit();
        saveView();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight")
        orbit(e.key === "ArrowLeft" ? -0.2 : 0.2);
      else if (e.key === "+" || e.key === "=") zoom(0.88);
      else if (e.key === "-") zoom(1.14);
      else {
        const s = new THREE.Spherical().setFromVector3(
          camera.position.clone().sub(controls.target),
        );
        s.phi = THREE.MathUtils.clamp(
          s.phi + (e.key === "ArrowUp" ? -0.12 : 0.12),
          controls.minPolarAngle,
          controls.maxPolarAngle,
        );
        camera.position
          .copy(controls.target)
          .add(new THREE.Vector3().setFromSpherical(s));
        controls.update();
        saveView();
      }
    }
  }
  function lost(e) {
    e.preventDefault();
    active = false;
    onError("三维画面暂时中断了，请点击“重新加载房间”。");
  }
  function visibility() {
    active = !document.hidden;
    lastFrame = 0;
  }
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", cancel);
  canvas.addEventListener("keydown", key);
  canvas.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", visibility);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colors = {
    day: new THREE.Color("#f8ece8"),
    dawn: new THREE.Color("#efd9df"),
    sunset: new THREE.Color("#e8c0b6"),
    night: new THREE.Color("#29283e"),
  };
  const cream = new THREE.Color("#fff0d5"),
    golden = new THREE.Color("#ffaf79"),
    moon = new THREE.Color("#9ab7fa");
  const shadeDay = new THREE.Color("#b7dce4"),
    shadeNight = new THREE.Color("#343a72");
  let hour = current.hour ?? 14;
  function animate(now) {
    if (disposed) return;
    frame = requestAnimationFrame(animate);
    if (!active) return;
    const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 1) : 0;
    const dt = Math.min(elapsed, .05);
    lastFrame = now;
    if (current.cycle) {
      hour = (hour + (elapsed * 24) / 100) % 24;
      if (now - lastClock > 400) {
        onTime(hour);
        lastClock = now;
      }
    } else hour = current.hour;
    const daylight = THREE.MathUtils.smoothstep(
      Math.sin(((hour - 6) / 12) * Math.PI),
      -0.08,
      0.45,
    );
    const sunset = Math.max(0, 1 - Math.abs(hour - 18) / 2.2),
      dawn = Math.max(0, 1 - Math.abs(hour - 6) / 2);
    const background = colors.night
      .clone()
      .lerp(colors.day, daylight)
      .lerp(colors.sunset, sunset * 0.7)
      .lerp(colors.dawn, dawn * 0.6);
    scene.background.copy(background);

    hemisphere.intensity = 0.38 + daylight * 0.92;
    fill.intensity = 0.16 + daylight * 0.30;
    scene.environmentIntensity = 0.12 + daylight * 0.28;
    sun.intensity = 0.25 + daylight * 1.9;
    sun.color
      .copy(moon)
      .lerp(cream, daylight)
      .lerp(golden, Math.max(sunset, dawn) * 0.8);
    const azimuth = ((hour - 6) / 12) * Math.PI;
    sun.position.set(
      Math.cos(azimuth) * 8,
      Math.max(3, Math.sin(azimuth) * 10),
      5,
    );
    model.materials.window.color.copy(shadeNight).lerp(shadeDay, daylight);
    model.materials.window.emissive.copy(shadeNight).lerp(shadeDay, daylight);
    model.sunOrb.material.color.set(daylight > 0.5 ? "#fff1b7" : "#e8eaff");
    model.sunOrb.material.emissive.set(daylight > 0.5 ? "#ffe0a0" : "#a1b7f2");
    model.bedsideLight.intensity = current.lamp ? 7 : 0;
    model.ceilingLight.intensity = current.chandelier ? 24 : 0;
    model.materials.lamp.emissiveIntensity = current.lamp ? 0.55 : 0;
    model.materials.bulb.emissiveIntensity = current.chandelier ? 0.8 : 0;
    model.materials.screen.emissiveIntensity = current.tv ? 0.9 : 0;
    model.tvStars.visible = current.tv;
    model.airflow.visible = current.ac;
    model.louver.rotation.x = THREE.MathUtils.lerp(
      model.louver.rotation.x,
      current.ac ? -0.48 : 0,
      0.13,
    );
    model.acLed.material.emissive.set(current.ac ? "#48e8b0" : "#000000");
    if (current.ac && !reduced.matches)
      model.airflow.position.y = -0.07 * Math.sin(now * 0.002);
    if (current.fan && !reduced.matches) model.blades.rotation.z -= dt * 15;
    model.doors.forEach(
      (door, i) =>
        (door.rotation.y = THREE.MathUtils.lerp(
          door.rotation.y,
          current.wardrobe ? (i === 0 ? -1.35 : 1.35) : 0,
          0.09,
        )),
    );
    model.canopy.forEach((curtain, i) => {
      curtain.scale.x = THREE.MathUtils.lerp(
        curtain.scale.x,
        current.curtains ? 2.25 : 1,
        0.08,
      );
      curtain.position.x = THREE.MathUtils.lerp(
        curtain.position.x,
        (i === 0 ? -1 : 1) * (current.curtains ? 0.62 : 1.02),
        0.08,
      );
    });
    model.back.visible = !current.cutaway || camera.position.z > -0.7;
    model.left.visible = !current.cutaway || camera.position.x > -0.7;
    controls.autoRotate = current.rotate && !reduced.matches;
    controls.autoRotateSpeed = 0.55;
    controls.update(dt);
    renderer.render(scene, camera);
    canvas.dataset.ready = "true";
    canvas.dataset.hour = hour.toFixed(2);
    canvas.dataset.azimuth = controls.getAzimuthalAngle().toFixed(3);
  }
  frame = requestAnimationFrame(animate);
  return {
    update(next) {
      current = { ...next };
    },
    reset() {
      fit();
      saveView();
    },
    orbit,
    zoom,
    snapshot() {
      renderer.render(scene, camera);
      return canvas.toDataURL("image/png");
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      observer.disconnect();
      controls.removeEventListener("end", saveView);
      controls.dispose();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      canvas.removeEventListener("keydown", key);
      canvas.removeEventListener("webglcontextlost", lost);
      document.removeEventListener("visibilitychange", visibility);
      model.dispose();
      env.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      sun.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
