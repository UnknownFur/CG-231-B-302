var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(80, WIDTH / HEIGHT);
camera.position.z = 4.5;
camera.position.x = -1.2;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);

scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

const light1 = new THREE.DirectionalLight(0x00ffff, 1);
light1.position.set(-1, 2, 4);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0x00ffff, 1);
light2.position.set(1, -2, -4);
scene.add(light2);

const size = 150;
const divisions = 160;
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

function generateRegularPolyhedronGeometry(n, r) {
  const geometry = new THREE.BufferGeometry();

  const vertices = [];
  const indices = [];

  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  // generate vertices
  for (let i = 0; i < n; i++) {
    const lat = Math.asin(-1 + 2 * i / n);
    const lon = 2 * Math.PI * i / goldenRatio;
    const x = r * Math.cos(lat) * Math.cos(lon);
    const y = r * Math.cos(lat) * Math.sin(lon);
    const z = r * Math.sin(lat);
    vertices.push(x, y, z);
  }

  // generate indices
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = i;
      const b = j;
      const c = (j + 1) % n;
      const d = (i + 1) % n;

      // add first triangle
      indices.push(a, b, d);

      // add second triangle
      indices.push(b, c, d);
    }
  }

  // set geometry attributes
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.addGroup(0, indices.length, 0);

  // set normal attribute
  geometry.computeVertexNormals();

  return geometry;
}

const n = 20;
const r = 1;
const polyhedron = generateRegularPolyhedronGeometry(n, r);
const material = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(polyhedron, material);
scene.add(mesh);


function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
