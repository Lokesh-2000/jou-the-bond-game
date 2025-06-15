
import React from "react";

// Updated snakes as per prompt
const SNAKES = [
  { from: 38, to: 15, color: '#33a852' },   // green
  { from: 47, to: 19, color: '#a633ea', pathOffset: { headX: -8, headY: 10 } },   // purple - adjusted head visible
  { from: 53, to: 35, color: '#12a9e9', pathOffset: { headX: 18, headY: -18 } },  // blue - adjusted head visible
  { from: 62, to: 55, color: '#fac03c' },   // yellow
  { from: 86, to: 54, color: '#fd3577' },   // pink/red
  { from: 88, to: 24, color: '#12a9e9' },   // blue (was 87-24, now 88-24)
  { from: 92, to: 70, color: '#33a852' },   // green
  { from: 94, to: 6,  color: '#a633ea' },   // purple
  { from: 97, to: 78, color: '#fac03c' },   // yellow
  { from: 82, to: 65, color: '#fd3577' },   // pink
  { from: 29, to: 8,  color: '#33a852' },   // green
];

const TILE_SIZE = 64;

// Layout: tile 1 (bottom-left), tile 100 (top-left)
function tileToXY(tileNum: number) {
  const n = tileNum - 1;
  const row = n / 10 >> 0;
  let col = n % 10;
  col = row % 2 === 0 ? col : 9 - col;
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: (9 - row) * TILE_SIZE + TILE_SIZE / 2,
  };
}

// Stylized "serious" snake head
function SnakeHead({ x, y, angle, color }: { x: number, y: number, angle: number, color: string }) {
  const size = TILE_SIZE * 0.8;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {/* Head base */}
      <ellipse cx="0" cy="0" rx={size * 0.32} ry={size * 0.23} fill={color} stroke="#232323" strokeWidth="2"/>
      {/* Angry eyebrows (serious) */}
      {/* Left eyebrow */}
      <path d={`
        M ${-size * 0.13} ${-size * 0.13}
        Q ${-size * 0.08} ${-size * 0.19} ${-size * 0.02} ${-size * 0.13}
      `} stroke="#211" strokeWidth="2" fill="none" />
      {/* Right eyebrow */}
      <path d={`
        M ${size * 0.13} ${-size * 0.13}
        Q ${size * 0.08} ${-size * 0.19} ${size * 0.02} ${-size * 0.13}
      `} stroke="#211" strokeWidth="2" fill="none" />
      {/* Eyes */}
      <ellipse cx={-size * 0.10} cy={-size * 0.08} rx={size*0.05} ry={size*0.07} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={-size * 0.10} cy={-size * 0.11} rx={size*0.024} ry={size*0.024} fill="#1b1b1b"/>
      <ellipse cx={size * 0.10} cy={-size * 0.08} rx={size*0.05} ry={size*0.07} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={size * 0.10} cy={-size * 0.11} rx={size*0.024} ry={size*0.024} fill="#1b1b1b"/>
      {/* Nose holes */}
      <ellipse cx={-size * 0.05} cy={size*0.01} rx={size*0.012} ry={size*0.022} fill="#222"/>
      <ellipse cx={size * 0.05} cy={size*0.01} rx={size*0.012} ry={size*0.022} fill="#222"/>
      {/* Mouth: serious (straight or downward) */}
      <path d={`
        M ${-size*0.06} ${size*0.11}
        Q 0 ${size*0.08} ${size*0.06} ${size*0.11}
      `} fill="none" stroke="#232323" strokeWidth="2" />
      {/* Tongue (still sticking out) */}
      <path d={`
        M 0 ${size*0.17}
        q 0 ${size*0.07} ${size*0.04} ${size*0.12}
        M 0 ${size*0.17}
        q 0 ${size*0.07} -${size*0.04} ${size*0.12}
      `} fill="none" stroke="#e35555" strokeWidth="2" />
    </g>
  );
}

const SnakeOverlay = () => {
  function renderSnake({ from, to, color, pathOffset }: typeof SNAKES[number], i: number) {
    let head = tileToXY(from);
    const tail = tileToXY(to);

    // Extend/offset head position if custom pathOffset set (for visual head separation)
    if (pathOffset) {
      head = { x: head.x + pathOffset.headX, y: head.y + pathOffset.headY };
    }

    const dx = tail.x - head.x, dy = tail.y - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // S-curve: Add more curvature for snakes whose head/tail need to be separated
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

    // Head angle for orientation
    const angle = Math.atan2(mid1.y - head.y, mid1.x - head.x) * 180 / Math.PI;
    const thickness = TILE_SIZE * 0.28;

    const bodyPath = `
      M ${head.x} ${head.y}
      C ${mid1.x} ${mid1.y} ${mid2.x} ${mid2.y} ${tail.x} ${tail.y}
    `;

    // Find the direction for a sharp tail: interpolate near the end, then extend further
    // Find near-tail direction (derivative at t ~ 1, i.e. 96%)
    function cubicBezier(ptA: number, ptB: number, ptC: number, ptD: number, t: number) {
      const mt = 1-t;
      return mt*mt*mt*ptA
        + 3*mt*mt*t*ptB
        + 3*mt*t*t*ptC
        + t*t*t*ptD;
    }
    function cubicBezierDeriv(ptA: number, ptB: number, ptC: number, ptD: number, t: number) {
      return 3*(1-t)*(1-t)*(ptB-ptA)
        + 6*(1-t)*t*(ptC-ptB)
        + 3*t*t*(ptD-ptC);
    }
    const sharpTailT = 0.96;
    const tailX = cubicBezier(head.x, mid1.x, mid2.x, tail.x, sharpTailT);
    const tailY = cubicBezier(head.y, mid1.y, mid2.y, tail.y, sharpTailT);
    const tailDx = cubicBezierDeriv(head.x, mid1.x, mid2.x, tail.x, 1);
    const tailDy = cubicBezierDeriv(head.y, mid1.y, mid2.y, tail.y, 1);
    const norm = Math.sqrt(tailDx*tailDx + tailDy*tailDy);

    // Extend sharp, pointy tail (line past tail along tangent)
    const tailSharpLen = thickness * 1.05;
    const tailSharpX = tail.x + (tailDx/norm) * tailSharpLen;
    const tailSharpY = tail.y + (tailDy/norm) * tailSharpLen;

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
        {/* Body details */}
        {Array.from({ length: 7 }).map((_, ringIdx) => {
          const t = 0.17 + 0.62 * (ringIdx / 6);
          function cubicBezier(posA: number, posB: number, posC: number, posD: number, t: number) {
            const mt = 1-t;
            return mt*mt*mt*posA
              + 3*mt*mt*t*posB
              + 3*mt*t*t*posC
              + t*t*t*posD;
          }
          const x = cubicBezier(head.x, mid1.x, mid2.x, tail.x, t);
          const y = cubicBezier(head.y, mid1.y, mid2.y, tail.y, t);
          const dxdt = 3*(1-t)*(1-t)*(mid1.x-head.x) + 6*(1-t)*t*(mid2.x-mid1.x) + 3*t*t*(tail.x-mid2.x);
          const dydt = 3*(1-t)*(1-t)*(mid1.y-head.y) + 6*(1-t)*t*(mid2.y-mid1.y) + 3*t*t*(tail.y-mid2.y);
          const perpAngle = Math.atan2(dydt, dxdt) + Math.PI/2;
          const rx = thickness*0.25, ry = thickness*0.11;
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
        {/* Snake head */}
        <SnakeHead x={head.x} y={head.y} angle={angle} color={color}/>
        {/* SHARP/POINTED TAIL */}
        <polygon
          points={`${tail.x - thickness*0.22},${tail.y - thickness*0.08} 
                  ${tail.x + thickness*0.22},${tail.y + thickness*0.08} 
                  ${tailSharpX},${tailSharpY}`}
          fill={color}
          opacity={0.86}
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

