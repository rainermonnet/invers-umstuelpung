'use strict';
// Gemeinsame WebGL-Bühne: Renderer, Kamera, Licht, Ziehen = Drehen, Rad/Pinch = Zoomen.
function makeStage(el, opts) {
  opts = opts || {};
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { el.innerHTML = '<div id="fail">WebGL ist in diesem Browser nicht verfügbar.</div>'; throw e; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 100), rig = new THREE.Group();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, .85));
  const sun = new THREE.DirectionalLight(0xffffff, .7); sun.position.set(3, 4, 5); scene.add(sun); scene.add(rig);
  const S = { scene, camera, rig, renderer, onFrame: null, view: { yaw: .7, pitch: .35, dist: opts.dist || 5 } };
  const V = S.view, pointers = new Map(), clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  function resize() { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(el); resize();
  el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); pointers.set(e.pointerId, e); el.style.cursor = 'grabbing'; });
  el.addEventListener('pointerup', e => { pointers.delete(e.pointerId); el.style.cursor = 'grab'; });
  el.addEventListener('pointermove', e => {
    const prev = pointers.get(e.pointerId); if (!prev) return;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]; pointers.set(e.pointerId, e); const [c, d] = [...pointers.values()];
      const k = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / Math.hypot(c.clientX - d.clientX, c.clientY - d.clientY);
      if (isFinite(k) && k > 0) V.dist = clamp(V.dist * k, 3, 15);
    } else { V.yaw -= (e.clientX - prev.clientX) * .008; V.pitch = clamp(V.pitch + (e.clientY - prev.clientY) * .008, -1.5, 1.5); pointers.set(e.pointerId, e); }
  });
  el.addEventListener('wheel', e => { e.preventDefault(); V.dist = clamp(V.dist * Math.exp(e.deltaY * .001), 3, 15); }, { passive: false });
  let t0 = performance.now();
  (function frame(t) {
    const dt = Math.min(.05, (t - t0) / 1000); t0 = t;
    if (S.onFrame) S.onFrame(dt);
    camera.position.set(V.dist * Math.cos(V.pitch) * Math.sin(V.yaw), V.dist * Math.sin(V.pitch), V.dist * Math.cos(V.pitch) * Math.cos(V.yaw));
    camera.up.set(0, 1, 0); camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  })(t0);
  return S;
}
