
export const TILE_SIZE = 64;

// For a given 1-based tileNum, returns center X/Y for head/tail
export function tileToXY(tileNum: number) {
  const n = tileNum - 1;
  const row = n / 10 >> 0;
  let col = n % 10;
  col = row % 2 === 0 ? col : 9 - col;
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: (9 - row) * TILE_SIZE + TILE_SIZE / 2,
  };
}

// Cubic Bezier interpolation helpers
export function cubicBezier(a: number, b: number, c: number, d: number, t: number) {
  const mt = 1 - t;
  return (
    mt * mt * mt * a +
    3 * mt * mt * t * b +
    3 * mt * t * t * c +
    t * t * t * d
  );
}

export function cubicBezierDeriv(a: number, b: number, c: number, d: number, t: number) {
  return (
    3 * (1 - t) * (1 - t) * (b - a) +
    6 * (1 - t) * t * (c - b) +
    3 * t * t * (d - c)
  );
}
