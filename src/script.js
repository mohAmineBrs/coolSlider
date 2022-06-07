import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import vertexShader from "./shaders/test/vertexShader.glsl";
import fragmentShader from "./shaders/test/fragmentShader.glsl";
import gsap from "gsap";
import { mapLinear } from "three/src/math/MathUtils";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const meshGroup = new THREE.Group();

// /**
//  * Loader
//  */
 const loading = document.querySelector('.loading');
 const loadinProgressNumber = document.querySelector('.loading-progress-number');

 const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
      // we can do it with setTimeout as wel
      gsap.delayedCall(0.5, () => {
        loading.classList.add('endLoading')
      })


  },
  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
      loading.style.willChange = 'transform';
      const progressRatio = itemsLoaded/itemsTotal
      loadinProgressNumber.innerHTML = Math.ceil(progressRatio * 100)
  }
)
loading.addEventListener('animationEnd', () => {
  this.style.willChange = 'auto';
});
/**
 * Variables & Functions
 */
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
let aspect = sizes.width / sizes.height
let speed = 0;
let position = 0;
let rounded = 0;
let titleHeadingElements = [...document.querySelectorAll(".titleHeading")];
let titleDescriptionElements = [...document.querySelectorAll(".titleDescription")];
let imageIndice = [...document.querySelectorAll(".imageIndice")];
let imagesContainer = document.querySelector('.imagesContainer');
let navItemElements = [...document.querySelectorAll('.navItem')];
let navLogo = document.querySelector('.logo');

let bgColor = ["#F2F2F2", "#F2DE79", "#C4E1F2", "#D90416", "#C491DB", "#01010E"]
let headingColor = ["#023238", "#C491DB", "#D90416", "#C4E1F2", "#F2DE79", "#FF4700"]
let descriptionColor = ["#01010E", "#01010E", "#01010E", "#F2F2F2", "#01010E", "#F2F2F2"]

let objs = Array(6).fill({ dist: 0 });
let matArray = [];
let meshesArray = [];
let groupsArray = [];
let textureWidth = 427;
let textureHeight = 313;
let textureMargin = 80;
let sliderXPos = 230;
// let sliderXPos = range(300, 1200, 0, 230, sizes.width);

let headingTitleHeight = 150


/**
 * Media Query
 */
 const mediumMediaQuery = window.matchMedia('only screen and (max-width: 992px)');
 const smallMediaQuery = window.matchMedia('only screen and (max-width: 600px)');

 if (mediumMediaQuery.matches) {
  textureWidth = 430;
  textureHeight = sizes.height * 0.45;
  textureMargin = 300;
  sliderXPos = 0;

 } 
 if (smallMediaQuery.matches) {
  textureHeight = sizes.width * 0.87;
  textureHeight = sizes.height * 0.45;
  textureMargin = 300;
  sliderXPos = 0;

 }
//  if (window.matchMedia(mediumMediaQuery).matches) {
//   textureMargin = 300;
//   sliderXPos = 0;
//  } 

 mediumMediaQuery.addEventListener('change', event => {
     console.log(window.innerWidth);
   if (event.matches) {
      textureWidth = sizes.width * 0.5;
      textureHeight = sizes.height * 0.45;
      textureMargin = 300;
      sliderXPos = 0;
   } else {
      textureWidth = 427;
      textureHeight = 313;
      textureMargin = 80;
      sliderXPos = 230;
  }
 })



/**
 * Mouse wheel effect
 */
 window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.0003;
  
});


/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader(loadingManager);

// Create Multi-Meshes

const geometry = new THREE.PlaneBufferGeometry(textureWidth, textureHeight, 20, 20);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTexture: { value: null },
    uTime: { value: 0 },
    uDistanceFromCenter: { value: 0 },
  },
  transparent: true,
});


let mesh
const handleImage = () => {
  let images = [...document.querySelectorAll("img")];
  images.forEach((img, i) => {
    let mat = material.clone();
    matArray.push(mat);
    mat.uniforms.uTexture.value = textureLoader.load(img.src);
    // mat.uniforms.uTexture.value.needsUpdate = true

    mesh = new THREE.Mesh(geometry, mat);
    // mesh.scale.set(textureWidth, textureHeight, 1)
    meshGroup.add(mesh);
    groupsArray.push(meshGroup)
    meshGroup.rotation.set(-0.45, -0.55, -0.3);

    // meshGroup.position.y = -0.4
    mesh.position.x = sliderXPos

    scene.add(meshGroup);
    mesh.position.y = - i * (textureHeight + textureMargin);
    meshesArray.push(mesh);
  });
};
handleImage();




/**
 * Resize Event
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.fov = (180 * (2 * Math.atan(sizes.height / 2 / 1000))) / Math.PI;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update Images on Resize
  meshesArray.forEach(mesh => mesh.position.x = sliderXPos)


});

/**
 * Camera
 */
// Base camera
let fov = (180 * (2 * Math.atan(sizes.height / 2 / 1000))) / Math.PI;
const camera = new THREE.PerspectiveCamera(
  fov,
  sizes.width / sizes.height,
  0.01,
  3000
);
camera.position.set(0, 0, 1000);
camera.lookAt(scene.position);
scene.add(camera);

/*****************************************************************************************/
// const camera = new THREE.OrthographicCamera(
//   sizes.width / - 2,
//   sizes.width / 2,
//   sizes.height / 2,
//   sizes.height / - 2,
//   1,
//   3000
// )
// camera.lookAt(scene.position)
// camera.position.z = 1000

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;



/**
 * Navbar interaction
 */
 let navList = document.querySelector('.navList')
 let navItems = [...document.querySelectorAll('.navItem')];
 let groupsRotation = groupsArray.map(rot => rot.rotation)
 let attractMode = false;
 let attractTo = 0;
 
 navList.addEventListener('mouseenter', () => {
     attractMode = true;
     gsap.to(groupsRotation, {
         duration: 0.4,
         x: -0.5,
         y: 0,
         z: 0
     })
 })
 navList.addEventListener('mouseleave', () => {
     attractMode = false;
     gsap.to(groupsRotation, {
         duration: 0.4,
         x: -0.45,
         y: -0.55,
         z: -0.3
     })
 })
 
 navItems.forEach(nav => {
     nav.addEventListener('mouseover', (e) => {
         attractTo = Number(e.target.getAttribute('data-nav'));
     })
 })
 


/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  if (matArray) {
    matArray.forEach((mat, i) => {
      mat.uniforms.uTime.value = elapsedTime;
    });
  }
  position += speed;
  speed *= 0.85;
  rounded = Math.round(position);
  let diff = rounded - position;

  if (attractMode) {
    position += -(position - attractTo) * 0.06;
    renderer.setClearColor(0x01010e)
    titleHeadingElements.forEach(el => el.classList.add("attractMode"))
    titleDescriptionElements.forEach(el => el.classList.add("attractMode"))
    imagesContainer.classList.add("attractMode")
    navItemElements.forEach(el => el.classList.add("attractMode"))
  } else {
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.5) * 0.03;
    renderer.setClearColor(bgColor[Math.round(position)])
    titleHeadingElements.forEach(el => el.classList.remove("attractMode"))
    titleDescriptionElements.forEach(el => el.classList.remove("attractMode"))
    imagesContainer.classList.remove("attractMode")
    navItemElements.forEach(el => el.classList.remove("attractMode"))
    imagesContainer.style.borderColor = headingColor[Math.round(position)]
    navLogo.style.color = descriptionColor[Math.round(position)]
  }
  position = clamp(position, (0-0.2), ((meshesArray.length - 1)+0.2))
  objs.forEach((obj, i) => {
    obj.dist = Math.min(Math.abs(position - i), 1);
    obj.dist = 1 - obj.dist ** 2;

    titleHeadingElements[i].style.transform = `translateY(${-position * headingTitleHeight * 2}px)`;
    imageIndice[i].style.transform = `translateX(${-position * 160}px)`;

    titleDescriptionElements[i].style.opacity = 0
    titleDescriptionElements[Math.round(position)].style.opacity = 1

    navItemElements[i].style.backgroundColor = "#888888"
    navItemElements[Math.round(position)].style.backgroundColor = headingColor[Math.round(position)]

    titleHeadingElements[i].style.color = headingColor[i]
    titleDescriptionElements[i].style.color = descriptionColor[i]


    let meshScale = 1 + 0.13 * obj.dist;
    meshesArray[i].scale.set(meshScale, meshScale, meshScale);
    meshesArray[i].position.y = -i * (textureHeight + textureMargin) + position * (textureHeight + textureMargin);
    meshesArray[i].material.uniforms.uDistanceFromCenter.value = obj.dist;
  });


  // Update controls
//   controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
