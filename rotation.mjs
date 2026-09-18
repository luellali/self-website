// Keep the accumulated angle: pausing must never reset or snap the model.
export function nextAngle(angle, delta, paused) {
  return paused ? angle : (angle + Math.min(delta, 0.05) * Math.PI * 2 / 45) % (Math.PI * 2);
}
export function isPaused({ hover, focus, manual, reduced, hidden }) {
  return hover || focus || manual || reduced || hidden;
}

// Face normals in the supplied GLB; offset by the camera's horizontal bearing.
export const CAMERA_BEARING = Math.atan2(1.35, 2.2);
export const FACE_ANGLES = Object.freeze({
  explorations: CAMERA_BEARING,
  course: CAMERA_BEARING - Math.PI / 2,
  design: CAMERA_BEARING - Math.PI,
  about: CAMERA_BEARING + Math.PI / 2,
});
export function shortestTurn(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
export function faceTransition(from, to, progress) {
  const t = Math.max(0, Math.min(1, progress));
  const eased = t * t * (3 - 2 * t);
  return from + shortestTurn(from, to) * eased;
}
