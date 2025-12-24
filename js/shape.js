import * as THREE from 'three';

/**
 * Creates a playing card style mesh, flat face with rounded corners.
 * @param {number} width - Width of the card.
 * @param {number} height - Height of the card.
 * @param {number} radius - Corner radius.
 * @param {THREE.Texture} [texture] - Texture to apply.
 * @returns {THREE.ShapeGeometry} Geometry of the card.
 */
export function createCard(width, height, radius, texture) {
    // Create rounded rectangle shape
    const shape = new THREE.Shape();
    const hw = width / 2;
    const hh = height / 2;

    shape.moveTo(-hw + radius, -hh);
    shape.lineTo(hw - radius, -hh);
    shape.quadraticCurveTo(hw, -hh, hw, -hh + radius);
    shape.lineTo(hw, hh - radius);
    shape.quadraticCurveTo(hw, hh, hw - radius, hh);
    shape.lineTo(-hw + radius, hh);
    shape.quadraticCurveTo(-hw, hh, -hw, hh - radius);
    shape.lineTo(-hw, -hh + radius);
    shape.quadraticCurveTo(-hw, -hh, -hw + radius, -hh);

    // Create geometry
    const geometry = new THREE.ShapeGeometry(shape);

    // UV mapping (0–1)
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    const size = new THREE.Vector2(
        bbox.max.x - bbox.min.x,
        bbox.max.y - bbox.min.y
    );

    const uvAttribute = geometry.attributes.uv;
    for (let i = 0; i < uvAttribute.count; i++) {
        const x = geometry.attributes.position.getX(i);
        const y = geometry.attributes.position.getY(i);
        uvAttribute.setXY(i, (x - bbox.min.x) / size.x, (y - bbox.min.y) / size.y);
    }
    uvAttribute.needsUpdate = true;

    const material = texture
        ? new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        : new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    return geometry
}
