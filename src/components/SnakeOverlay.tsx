
import React from "react";

// Same snakes, but we'll use body color = head color, and improve detail
const SNAKES = [
  { from: 38, to: 15, color: '#33a852' },   // green
  { from: 47, to: 19, color: '#a633ea' },   // purple
  { from: 53, to: 35, color: '#12a9e9' },   // blue
  { from: 62, to: 55, color: '#fac03c' },   // yellow
  { from: 86, to: 54, color: '#fd3577' },   // pink/red
  { from: 87, to: 24, color: '#12a9e9' },   // blue
  { from: 92, to: 70, color: '#33a852' },   // green
  { from: 94, to: 6,  color: '#a633ea' },   // purple
  { from: 97, to: 78, color: '#fac03c' },   // yellow
  { from: 82, to: 65, color: '#fd3577' },   // pink
  { from: 29, to: 8,  color: '#33a852' },   // green
];

const TILE_SIZE = 64;

// Layout: tile 1 (bottom-left), tile 100 (top-left)
function tileToXY(tileNum: number) {
  // Row 0 = bottom
  const n = tileNum - 1;
  const row = n / 10 >> 0;
  let col = n % 10;
  // Even rows: left to right; Odd rows: right to left
  col = row % 2 === 0
    ? col
    : 9 - col;
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: (9 - row) * TILE_SIZE + TILE_SIZE / 2,
  };
}

// Stylized snake head (rounded, with eyes, mouth, tongue, color-uniform)
function SnakeHead({ x, y, angle, color }: { x: number, y: number, angle: number, color: string }) {
  const size = TILE_SIZE * 0.8;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {/* Head base */}
      <ellipse cx="0" cy="0" rx={size * 0.32} ry={size * 0.23} fill={color} stroke="#232323" strokeWidth="2"/>
      {/* Eye Left */}
      <ellipse cx={-size * 0.10} cy={-size * 0.08} rx={size*0.05} ry={size*0.07} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={-size * 0.10} cy={-size * 0.11} rx={size*0.024} ry={size*0.024} fill="#1b1b1b"/>
      {/* Eye Right */}
      <ellipse cx={size * 0.10} cy={-size * 0.08} rx={size*0.05} ry={size*0.07} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={size * 0.10} cy={-size * 0.11} rx={size*0.024} ry={size*0.024} fill="#1b1b1b"/>
      {/* Nose holes */}
      <ellipse cx={-size * 0.05} cy={size*0.01} rx={size*0.012} ry={size*0.022} fill="#222"/>
      <ellipse cx={size * 0.05} cy={size*0.01} rx={size*0.012} ry={size*0.022} fill="#222"/>
      {/* Mouth */}
      <path d={`
        M ${-size*0.08} ${size*0.1}
        Q 0 ${size*0.17} ${size*0.08} ${size*0.1}
      `} fill="none" stroke="#232323" strokeWidth="2" />
      {/* Tongue */}
      <path d={`
        M 0 ${size*0.18}
        q 0 ${size*0.07} ${size*0.04} ${size*0.12}
        M 0 ${size*0.18}
        q 0 ${size*0.07} -${size*0.04} ${size*0.12}
      `} fill="none" stroke="#e35555" strokeWidth="2" />
    </g>
  );
}

// Draw body markings (rings/dots/zigzags)
function drawBodyDetail(pathId: string, color: string, num: number) {
  // Dots along snake
  const marks = [];
  for (let i = 0; i < num; ++i) {
    const pct = 0.15 + (i / (num-1)) * 0.68;
    marks.push(
      <circle
        key={i}
        r="7"
        fill="#fff9"
        stroke="#aaa"
        strokeWidth="1"
      >
        <animateMotion dur="0.1s" repeatCount="1" />
        <animate
          attributeName="fill"
          values="#fff9;#fff5;#fff9"
          keyTimes="0;0.5;1"
          dur="2s"
          repeatCount="indefinite"
          begin={`${i*0.2}s`}
        />
        <set attributeName="display" to="inline" />
        <animateMotion
          dur="0.01s"
          repeatCount="1"
        />
        <mpath xlinkHref={`#${pathId}`} href={`#${pathId}`} key={i+10} />
        <animateMotion
          pathLength={pct}
          keyPoints={`${pct}`}
          repeatCount="1"
          fill="freeze"
        />
      </circle>
    );
  }
  return marks;
}

const SnakeOverlay = () => {
  function renderSnake({ from, to, color }: typeof SNAKES[number], i: number) {
    const head = tileToXY(from);
    const tail = tileToXY(to);

    // Main axis
    const dx = tail.x - head.x, dy = tail.y - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // S-shaped Bézier controls
    const curveAmount = Math.max(TILE_SIZE * 1.2, dist / 2.2);
    const mid1 = {
      x: head.x + dx * 0.35 + (dy / dist) * curveAmount * 0.6,
      y: head.y + dy * 0.35 - (dx / dist) * curveAmount * 0.6,
    };
    const mid2 = {
      x: head.x + dx * 0.72 - (dy / dist) * curveAmount * 0.6,
      y: head.y + dy * 0.72 + (dx / dist) * curveAmount * 0.6,
    };

    const pathId = `snakepath-${i}`;
    // For head orientation
    const angle = Math.atan2(mid1.y - head.y, mid1.x - head.x) * 180 / Math.PI;

    // Snake body: uniform color, add some white patterning
    const thickness = TILE_SIZE * 0.28;

    const bodyPath = `
      M ${head.x} ${head.y}
      C ${mid1.x} ${mid1.y} ${mid2.x} ${mid2.y} ${tail.x} ${tail.y}
    `;

    return (
      <g key={`snake${i}`}>
        {/* Body shadow */}
        <path
          d={bodyPath}
          stroke="#1b1b1b22"
          strokeWidth={thickness * 1.16}
          fill="none"
          strokeLinecap="round"
          filter="drop-shadow(0 2px 6px #0002)"
        />
        {/* Snake body */}
        <path
          id={pathId}
          d={bodyPath}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          filter="drop-shadow(0 2px 6px #0002)"
        />
        {/* Body details (simple rings) */}
        {Array.from({ length: 7 }).map((_, ringIdx) => {
          const t = 0.17 + 0.62 * (ringIdx / 6); // Ring spaced along path
          // Interpolate cubic Bézier
          function cubicBezier(posA: number, posB: number, posC: number, posD: number, t: number) {
            const mt = 1-t;
            return mt*mt*mt*posA
              + 3*mt*mt*t*posB
              + 3*mt*t*t*posC
              + t*t*t*posD;
          }
          const x = cubicBezier(head.x, mid1.x, mid2.x, tail.x, t);
          const y = cubicBezier(head.y, mid1.y, mid2.y, tail.y, t);
          // Perpendicular direction for width
          const dxdt = 3*(1-t)*(1-t)*(mid1.x-head.x) + 6*(1-t)*t*(mid2.x-mid1.x) + 3*t*t*(tail.x-mid2.x);
          const dydt = 3*(1-t)*(1-t)*(mid1.y-head.y) + 6*(1-t)*t*(mid2.y-mid1.y) + 3*t*t*(tail.y-mid2.y);
          const perpAngle = Math.atan2(dydt, dxdt) + Math.PI/2;
          const rx = (thickness*0.25);
          const ry = (thickness*0.11);
          return (
            <ellipse
              key={ringIdx}
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill="#fff"
              fillOpacity={0.6}
              stroke="#fff"
              strokeWidth="1"
              opacity={0.65}
              transform={`rotate(${perpAngle*180/Math.PI},${x},${y})`}
            />
          );
        })}
        {/* Snake head (facing along path) */}
        <SnakeHead x={head.x} y={head.y} angle={angle} color={color}/>
        {/* Tail: small taper ellipse */}
        <ellipse
          cx={tail.x}
          cy={tail.y}
          rx={thickness*0.36}
          ry={thickness*0.13}
          fill={color}
          opacity={0.9}
        />
      </g>
    );
  }

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
