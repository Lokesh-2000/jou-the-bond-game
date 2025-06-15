
export const TILE_SIZE = 64;

// Helper: get tile corner (corner: 'tl', 'tr', 'bl', 'br')
// Used for ladder overlays ("from" is always the bottom of the ladder)
export function tileToCorner(tileNum: number, corner: "tl" | "tr" | "bl" | "br") {
  const n = tileNum - 1;
  const row = Math.floor(n / 10);
  let col = n % 10;
  if (row % 2 === 1) col = 9 - col;
  let x = col * TILE_SIZE, y = (9 - row) * TILE_SIZE;
  if (corner === "tl") {
    x += TILE_SIZE * 0.21; y += TILE_SIZE * 0.22;
  } else if (corner === "tr") {
    x += TILE_SIZE * 0.82; y += TILE_SIZE * 0.18;
  } else if (corner === "bl") {
    x += TILE_SIZE * 0.19; y += TILE_SIZE * 0.82;
  } else if (corner === "br") {
    x += TILE_SIZE * 0.85; y += TILE_SIZE * 0.80;
  }
  return { x, y };
}
