import * as THREE from 'three';

import {getBackTexture, getFrontTexture, loadTextures, pickNewFrontTexture} from './js/texture.js';

import {TrackballControls} from 'three/addons/controls/TrackballControls.js';
import {createCard} from './js/shape.js';

await loadTextures();

/* Scene */
const scene = new THREE.Scene();

/* Camera */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.2, 1);

/* Card object */
let texture = getFrontTexture();
const card_geometry = createCard(0.432, 0.672, 0.045, texture)
const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
const card_plane = new THREE.Mesh(card_geometry, material);
scene.add(card_plane)

/* Renderer */
const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Rotate controls */
const controls = new TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.noZoom = true;
controls.rotateSpeed = 5;
controls.dynamicDampingFactor = 0.1

/* Control change position */
const worldNormal = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
let wasBackView = false;

// small hysteresis threshold to prevent flipping repeatedly when near edge
const FLIP_THRESHOLD = 0.05; // tune between 0.05 - 0.2

controls.addEventListener('change', async () => {
    worldNormal.set(0, 0, 1)
        .applyQuaternion(card_plane.quaternion)
        .normalize();

    cameraDirection
        .subVectors(camera.position, card_plane.getWorldPosition(new THREE.Vector3()))
        .normalize();

    const isBackView = worldNormal.dot(cameraDirection) < -FLIP_THRESHOLD;

    if (isBackView !== wasBackView) {
        if (isBackView) {
            const backTex = getBackTexture();
            if (material.map !== backTex) material.map = backTex;
            pickNewFrontTexture();
        } else {
            const frontTex = getFrontTexture();
            if (material.map !== frontTex) material.map = frontTex;
        }
        wasBackView = isBackView;
    }
});

window.addEventListener('resize', onWindowResize);
renderer.setAnimationLoop(animate);

function animate() {
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}