
import React from "react";

// Settings: snake path fromTile to toTile, color, curve pattern
const SNAKES = [
  // head, tail, color
  // (tile numbers below, all curved paths in SVG, colors stylized)
  { from: 38, to: 15, color: '#33a852', accent: '#278138' },   // green
  { from: 47, to: 19, color: '#a633ea', accent: '#6d1dae' },   // purple
  { from: 53, to: 35, color: '#12a9e9', accent: '#0c73b7' },   // blue
  { from: 62, to: 55, color: '#fac03c', accent: '#c58d1f' },   // yellow
  { from: 86, to: 54, color: '#fd3577', accent: '#b91c3c' },   // pink/red
  { from: 87, to: 24, color: '#12a9e9', accent: '#278138' },   // blue->green
  { from: 92, to: 70, color: '#33a852', accent: '#fac03c' },   // green/yellow
  { from: 94, to: 6,  color: '#a633ea', accent: '#fd3577' },   // purple/pink
  { from: 97, to: 78, color: '#fac03c', accent: '#b91c3c' },   // yellow/red
  { from: 82, to: 65, color: '#fd3577', accent: '#12a9e9' },   // pink/blue
  { from: 29, to: 8,  color: '#33a852', accent: '#a633ea' },   // green/purple
];

// Board geometry constants
const TILE_SIZE = 64;
const BOARD_ROWS = 10;

// Helper to convert tile # to x, y (center of tile), board is serpentine (like normal Snakes & Ladders)
function tileToXY(tileNum: number) {
  const n = tileNum - 1;
  const row = Math.floor(n / 10);
  let col = n % 10;
  if (row % 2 === 1) col = 9 - col; // reverse every other row
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: (9 - row) * TILE_SIZE + TILE_SIZE / 2, // y = 0 at top, row 0 is bottom
  };
}

const SnakeOverlay = () => {
  // Each snake gets a smooth S path
  function renderSnake({ from, to, color, accent }: typeof SNAKES[number], i: number) {
    const head = tileToXY(from);
    const tail = tileToXY(to);

    // Main axis
    const dx = tail.x - head.x, dy = tail.y - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // S-shape mid control point offset
    const curveAmount = Math.max(TILE_SIZE * 1.2, dist / 2.2);

    // Place 3 points: head (start), mid (S), tail (end) for Bézier
    const mid1 = {
      x: head.x + dx * 0.33 + (dy / dist) * curveAmount * 0.7,
      y: head.y + dy * 0.33 - (dx / dist) * curveAmount * 0.7,
    };
    const mid2 = {
      x: head.x + dx * 0.66 - (dy / dist) * curveAmount * 0.7,
      y: head.y + dy * 0.66 + (dx / dist) * curveAmount * 0.7,
    };

    // Proportions
    const thickness = TILE_SIZE * 0.32;
    const headRadius = TILE_SIZE * 0.40;
    const tailRadius = TILE_SIZE * 0.16;

    // Snake path - thick path, then overlay head
    const snakeId = `snake${i}`;

    // Approximate. For fun, spiral the path a bit for wiggle.
    const pathD = `
      M ${head.x} ${head.y}
      C ${mid1.x} ${mid1.y} ${mid2.x} ${mid2.y} ${tail.x} ${tail.y}
    `;

    // SVG gradient for body
    return (
      <g key={snakeId}>
        <defs>
          <linearGradient id={`snake-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor={accent} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {/* Snake body */}
        <path
          d={pathD}
          stroke={`url(#snake-gradient-${i})`}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.11))"
        />
        {/* Snake head: circle overlay at the start */}
        <ellipse
          cx={head.x}
          cy={head.y}
          rx={headRadius * 0.94}
          ry={headRadius * 0.94}
          fill={color}
          stroke={accent}
          strokeWidth={TILE_SIZE * 0.09}
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.09))"
        />
        {/* Eyes on head, simple: two white/black circles */}
        <ellipse
          cx={head.x + headRadius * 0.26}
          cy={head.y - headRadius * 0.18}
          rx={headRadius * 0.13}
          ry={headRadius * 0.10}
          fill="#fff"
          stroke="#222"
          strokeWidth="1"
        />
        <ellipse
          cx={head.x + headRadius * 0.28}
          cy={head.y - headRadius * 0.18}
          rx={headRadius * 0.08}
          ry={headRadius * 0.07}
          fill="#222"
        />
        {/* Tail: small ellipse */}
        <ellipse
          cx={tail.x}
          cy={tail.y}
          rx={tailRadius}
          ry={tailRadius * 0.55}
          fill={color}
        />
      </g>
    );
  }

  // Overlay SVG for all snakes (absolute pos, not pointer events)
  return (
    <svg
      width={TILE_SIZE * 10}
      height={TILE_SIZE * 10}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        zIndex: 9,
      }}
      viewBox={`0 0 ${TILE_SIZE * 10} ${TILE_SIZE * 10}`}
    >
      {SNAKES.map((sn, i) => renderSnake(sn, i))}
    </svg>
  );
};

export default SnakeOverlay;
