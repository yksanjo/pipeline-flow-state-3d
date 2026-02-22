import * as THREE from "https://unpkg.com/three@0.168.0/build/three.module.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
camera.position.set(0, 4, 12);

const light = new THREE.DirectionalLight(0xaec4ff, 1.4);
light.position.set(5, 8, 6);
scene.add(light);
scene.add(new THREE.AmbientLight(0x6d82b5, 0.45));

const nodes = [];
for (let i = 0; i < 14; i += 1) {
  const node = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xff7b7b : 0x9bc7ff })
  );
  node.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 8
  );
  node.userData = { phase: Math.random() * Math.PI * 2 };
  nodes.push(node);
  scene.add(node);
}

const linkMaterial = new THREE.LineBasicMaterial({ color: 0x5f76a0, transparent: true, opacity: 0.5 });
for (let i = 0; i < nodes.length - 1; i += 1) {
  const points = [nodes[i].position, nodes[i + 1].position];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  scene.add(new THREE.Line(geometry, linkMaterial));
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);
resize();

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  for (const node of nodes) {
    node.position.y += Math.sin(t + node.userData.phase) * 0.0015;
    node.scale.setScalar(1 + Math.sin((t * 2) + node.userData.phase) * 0.03);
  }
  scene.rotation.y = t * 0.12;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
