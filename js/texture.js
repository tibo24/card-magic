import * as THREE from 'three';

const loader = new THREE.TextureLoader();

const colorCodes = ['C', 'D', 'H', 'S'];
const numberCodes = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const textures = {}
const frontTextures = [];

const backsides = ['1B', '2B'];
const backTextures = []
let back_index = 0;
let front_index = 0;

/**
 * Creates a texture of a random card combination.
 * @returns {THREE.Texture}
 */
export function getFrontTexture() {
    return frontTextures[front_index];
}

/**
 * Pick and return a new random front texture id (stable until next call).
 */
export function pickNewFrontTexture() {
    const randomNumber = Math.floor(Math.random() * frontTextures.length);
    front_index = randomNumber;
}

/**
 * Creates a texture of the backside of a card. Swaps color each time.
 * @returns {THREE.Texture}
 */
export function getBackTexture() {
    let backTex = backTextures[back_index];
    back_index = 1 - back_index;
    return backTex;
}

/**
 * Loads all card textures asynchronously and stores them in the `textures` map.
 * Also preloads backside images. Resolves when all textures are loaded.
 */
export async function loadTextures() {
    const frontPromises = [];
    for (let c of colorCodes) {
        for (let n of numberCodes) {
            let fileName = `${n}${c}.png`;
            const p = loader.loadAsync(`images/cards/${fileName}`).then(tx => {
                frontTextures.push(tx);
            });
            frontPromises.push(p);
        }
    }

    const backPromises = backsides.map(id => loader.loadAsync(`images/cards/${id}.png`).then(tx => backTextures.push(tx)))

    await Promise.all([...frontPromises, ...backPromises]);
    pickNewFrontTexture();
}