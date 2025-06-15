
import React from "react";
import SnakeHead from "./SnakeHead";
import { TILE_SIZE, tileToXY, cubicBezier, cubicBezierDeriv } from "../utils/snakeMath";

// Snake positions (53-35 to 53-31)
const SNAKES = [
  { from: 38, to: 15, color: '#33a852' },   // green
  { from: 47, to: 19, color: '#a633ea', pathOffset: { headX: -8, headY: 10 } },   // purple - adjusted head visible
  { from: 53, to: 31, color: '#12a9e9', pathOffset: { headX: 18, headY: -18 } },  // blue - changed path, adjusted
  { from: 62, to: 55, color: '#fac03c' },   // yellow
  { from: 86, to: 54, color: '#fd3577' },   // pink/red
  { from: 88, to: 24, color: '#12a9e9' },   // blue (was 87-24, now 88-24)
  { from: 92, to: 70, color: '#33a852' },   // green
  { from: 94, to: 6,  color: '#a633ea' },   // purple
  { from: 97, to: 78, color: '#fac03c' },   // yellow
  { from: 82, to: 65, color: '#fd3577' },   // pink
  { from: 29, to: 8,  color: '#33a852' },   // green
];

export const SNAKE_PATHS = SNAKES.map(({ from, to, color, pathOffset }) => {
  let head = tileToXY(from);
  const tail = tileToXY(to);
  if (pathOffset) {
    head = { x: head.x + pathOffset.headX, y: head.y + pathOffset.headY };
  }

  const dx = tail.x - head.x, dy = tail.y - head.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const curveAmount = Math.max(TILE_SIZE * 1.2, dist / 2.2);
  const mid1 = {
    x: head.x + dx * 0.35 + (dy / dist) * curveAmount * 0.6,
    y: head.y + dy * 0.35 - (dx / dist) * curveAmount * 0.6,
  };
  const mid2 = {
    x: head.x + dx * 0.72 - (dy / dist) * curveAmount * 0.6,
    y: head.y + dy * 0.72 + (dx / dist) * curveAmount * 0.6,
  };
  return { head, mid1, mid2, tail, color };
});

const SnakeOverlay = () => {
  function renderSnake({ from, to, color, pathOffset }: typeof SNAKES[number], i: number) {
    let head = tileToXY(from);
    const tail = tileToXY(to);

    if (pathOffset) {
      head = { x: head.x + pathOffset.headX, y: head.y + pathOffset.headY };
    }

    const dx = tail.x - head.x, dy = tail.y - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // S-curve
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

    // HEAD ANGLE: Always 0 (horizontal), per user request
    const angle = 0;
    const thickness = TILE_SIZE * 0.28;

    const bodyPath = `
      M ${head.x} ${head.y}
      C ${mid1.x} ${mid1.y} ${mid2.x} ${mid2.y} ${tail.x} ${tail.y}
    `;

    // Calculate sharp tail
    const sharpTailT = 0.96;
    const tailX = cubicBezier(head.x, mid1.x, mid2.x, tail.x, sharpTailT);
    const tailY = cubicBezier(head.y, mid1.y, mid2.y, tail.y, sharpTailT);
    const tailDx = cubicBezierDeriv(head.x, mid1.x, mid2.x, tail.x, 1);
    const tailDy = cubicBezierDeriv(head.y, mid1.y, mid2.y, tail.y, 1);
    const norm = Math.sqrt(tailDx*tailDx + tailDy*tailDy);

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
          function cubicBezierX(a:number,b:number,c:number,d:number,t:number) {
            const mt = 1-t;
            return mt*mt*mt*a + 3*mt*mt*t*b + 3*mt*t*t*c + t*t*t*d;
          }
          const x = cubicBezierX(head.x, mid1.x, mid2.x, tail.x, t);
          const y = cubicBezierX(head.y, mid1.y, mid2.y, tail.y, t);
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
        {/* Snake head (angle = 0 so always horizontal) */}
        <SnakeHead x={head.x} y={head.y} angle={angle} color={color} tileSize={TILE_SIZE} />
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

export { SNAKES };
export default SnakeOverlay;
