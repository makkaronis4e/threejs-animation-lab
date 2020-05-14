var camera, scene, renderer, controls;
var mesh;
var THREE;
var OrbitControls;
const objects = [];
let animationActive;

init();
// animate();

function init() {
  initDomFunc();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;
  const spread = 10;
  scene = new THREE.Scene();

  //Cube
  const width = 100;
  const height = 100;
  const depth = 100;
  const cubeGeometry = new THREE.BoxBufferGeometry(width, height, depth);
  addLinedGeometry(new THREE.EdgesGeometry(cubeGeometry), 15, 0);

  // Torus
  const radius = 50;
  const tubeRadius = 20;
  const radialSegments = 80;
  const tubularSegments = 240;
  const torusGeometry = new THREE.TorusBufferGeometry(
    radius,
    tubeRadius,
    radialSegments,
    tubularSegments
  );
  addFilledGeometry(torusGeometry, -25, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  initControl();

  window.addEventListener("resize", onWindowResize, false);

  function addFilledGeometry(geometry, x, y) {
    const material = new THREE.MeshBasicMaterial({ color: 0x805e9c });
    const mesh = new THREE.Mesh(geometry, material);
    addObjectToScene(mesh, x, y);
  }

  function addLinedGeometry(geometry, x, y) {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.LineSegments(geometry, material);
    addObjectToScene(mesh, x, y);
  }

  function addObjectToScene(obj, x, y) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;
    scene.add(obj);
    objects.push(obj);
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if (animationActive) {
    objects.forEach((obj) => {
      obj.rotation.x += 0.005;
      obj.rotation.y += 0.01;
    });
    requestAnimationFrame(animate);
    controls.update();
  }
  render();
  checkRotation();
}

function initDomFunc() {
  const animateButton = document.getElementById("animateButton");
  const cancelAnimationButton = document.getElementById(
    "cancelAnimationButton"
  );
  animateButton.addEventListener("click", () => {
    animationActive = true;
    animateButton.setAttribute("disabled", "disabled");
    cancelAnimationButton.removeAttribute("disabled");
    animate();
  });

  cancelAnimationButton.addEventListener("click", () => {
    cancelAnimationButton.setAttribute("disabled", "disabled");
    animateButton.removeAttribute("disabled");
    animationActive = false;
    animate();
  });
}

function initControl() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;
  controls.addEventListener("change", render);

  controls.center = new THREE.Vector3(0, 0, 0);
  controls.autoRotate = true;
}

function checkRotation() {
  const rotSpeed = 0.9;
  const x = camera.position.x,
    y = camera.position.y,
    z = camera.position.z;

  if (keyboard.pressed("left")) {
    camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
  } else if (keyboard.pressed("right")) {
    camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
  }

  camera.lookAt(scene.position);
}
