import React from "react";
import SnakeHead from "./SnakeHead";
import { TILE_SIZE, tileToXY, cubicBezier, cubicBezierDeriv } from "../utils/snakeMath";

// Updated snakes as per prompt
const SNAKES = [
  { from: 38, to: 15, color: '#33a852' },   // green
  { from: 47, to: 19, color: '#a633ea', pathOffset: { headX: -8, headY: 10 } },   // purple
  { from: 53, to: 31, color: '#12a9e9', pathOffset: { headX: 18, headY: -18 } },  // blue
  { from: 62, to: 55, color: '#fac03c' },   // yellow
  { from: 86, to: 54, color: '#fd3577' },   // pink/red
  { from: 88, to: 24, color: '#12a9e9' },   // blue (was 87-24, now 88-24)
  { from: 92, to: 70, color: '#33a852' },   // green
  { from: 94, to: 6,  color: '#a633ea' },   // purple
  { from: 97, to: 78, color: '#fac03c' },   // yellow
  { from: 82, to: 65, color: '#fd3577' },   // pink
  { from: 29, to: 8,  color: '#33a852' },   // green
];

// Use a color-to-style map for custom tail/shape by color (from refs)
const SNAKE_TAIL_STYLES: Record<string, { tailTaper: number; tailLen: number; tailCurve?: number }> = {
  "#12a9e9": { tailTaper: 0.10, tailLen: 2.5, tailCurve: 0.13 },
  "#33a852": { tailTaper: 0.18, tailLen: 1.7, tailCurve: 0.15 }, // strong curve for green
  "#a633ea": { tailTaper: 0.15, tailLen: 1.4 },
  "#fac03c": { tailTaper: 0.18, tailLen: 1.4 },
  "#fd3577": { tailTaper: 0.18, tailLen: 1.5 },
};

const SnakeOverlay = () => {
  function renderSnake({ from, to, color, pathOffset }: typeof SNAKES[number], i: number) {
    let head = tileToXY(from);
    const tail = tileToXY(to);

    if (pathOffset) {
      head = { x: head.x + pathOffset.headX, y: head.y + pathOffset.headY };
    }

    const dx = tail.x - head.x, dy = tail.y - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // S-curve, as before
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

    const tailStyle = SNAKE_TAIL_STYLES[color] || { tailTaper: 0.14, tailLen: 1.4 };
    // Segment proportions for main body/curve
    const bodyPath = `
      M ${head.x} ${head.y}
      C ${mid1.x} ${mid1.y} ${mid2.x} ${mid2.y} ${tail.x} ${tail.y}
    `;

    // Curve tail: continue curve past tail endpoint for a rounder tip, do not use polygon "point".
    const tailCurveT = 1.06; // slight extension along curve, not a sharp line
    const tailEndX = cubicBezier(head.x, mid1.x, mid2.x, tail.x, tailCurveT);
    const tailEndY = cubicBezier(head.y, mid1.y, mid2.y, tail.y, tailCurveT);

    // At the actual tail, it's narrower, so draw a circle/ellipse for round tip
    const tailTipRad = thickness * (tailStyle.tailTaper ?? 0.13) * 1.4;

    // Stripes logic is unchanged (still overlays, banded ellipses)
    const bandColors = {
      "#33a852": "#11953c",
      "#12a9e9": "#48ffe1",
      "#a633ea": "#ef40cd",
      "#fac03c": "#f9b134",
      "#fd3577": "#cc2557",
    };
    const hasBands = color === "#33a852" || color === "#12a9e9" || color === "#a633ea";

    // Instead of a polygon (pointy tail), use a round tip:
    // Draw a short thick segment from tail to tailEnd, then draw a round ellipse at tailEnd
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
        {/* Body bands/stripes/dots */}
        {hasBands && Array.from({ length: 7 }).map((_, bandIdx) => {
          const t = 0.12 + 0.72 * (bandIdx / 6);
          const x = cubicBezier(head.x, mid1.x, mid2.x, tail.x, t);
          const y = cubicBezier(head.y, mid1.y, mid2.y, tail.y, t);
          let rx = thickness*0.28, ry = thickness*0.13;
          if (color === "#a633ea") { 
            rx *= 1.4; ry *= 1.1;
          }
          return (
            <ellipse
              key={bandIdx}
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill={bandColors[color] || "#999"}
              fillOpacity={ color === "#a633ea" ? 0.26 : 0.32 }
              stroke="none"
              opacity={0.82}
              transform={`rotate(${(bandIdx%2)*24 - 10},${x},${y})`}
            />
          );
        })}
        {/* Light edge highlight on snake's back */}
        <path
          d={bodyPath}
          stroke="#fff6"
          strokeWidth={thickness*0.18}
          fill="none"
          strokeLinecap="round"
          style={{
            filter: color === "#33a852" ? "blur(0.5px)" : "",
            opacity: 0.55,
            mixBlendMode: "screen"
          }}
        />
        {/* Snake head */}
        <SnakeHead x={head.x} y={head.y} angle={angle} color={color} tileSize={TILE_SIZE} />
        {/* CURVED, ROUND TIP TAIL (no pointy polygon!) */}
        <path
          d={`
            M ${tail.x} ${tail.y}
            L ${tailEndX} ${tailEndY}
          `}
          stroke={color}
          strokeWidth={thickness * tailStyle.tailTaper}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx={tailEndX}
          cy={tailEndY}
          rx={tailTipRad * 0.8}
          ry={tailTipRad * 1.08}
          fill={color}
          opacity={0.91}
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
