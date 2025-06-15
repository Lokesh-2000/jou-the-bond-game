
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
  "#12a9e9": { tailTaper: 0.10, tailLen: 2.5, tailCurve: 0.13 }, // ultra-long blue tail like img
  "#33a852": { tailTaper: 0.18, tailLen: 1.7 },
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

    // SHARPLY EXTENDED, THIN TAIL (after normal endpoint)
    // tA = 1.0 (tail tile), tB = 1.0 + tailLen/bodyLen, and interpolate/taper
    // We'll extend using the tangent at t=1 and fade thickness to nothing

    const sharpTailT = 0.96;
    const nearTailX = cubicBezier(head.x, mid1.x, mid2.x, tail.x, sharpTailT);
    const nearTailY = cubicBezier(head.y, mid1.y, mid2.y, tail.y, sharpTailT);
    const tailDx = cubicBezierDeriv(head.x, mid1.x, mid2.x, tail.x, 1);
    const tailDy = cubicBezierDeriv(head.y, mid1.y, mid2.y, tail.y, 1);
    const norm = Math.sqrt(tailDx * tailDx + tailDy * tailDy);

    // Length/shape for extension
    const extLen = thickness * 3.4 * (tailStyle.tailLen || 1.4);
    const tailTaper = tailStyle.tailTaper; // 0.1 = ultra-thin end

    const tailTipX = tail.x + (tailDx / norm) * extLen;
    const tailTipY = tail.y + (tailDy / norm) * extLen;

    // Body details: add ellipse "bands" like sample image
    // (optional: only for certain colors, e.g. green, purple, blue)

    // Stripes: Use color/positions like green image (bands, offset each segment)
    const bandColors = {
      "#33a852": "#1d8842",
      "#12a9e9": "#27d8e5",
      "#a633ea": "#ff3dcd", // magenta spots for purple
      "#fac03c": "#f9b134",
      "#fd3577": "#cc2557",
    };
    const hasBands = color === "#33a852" || color === "#12a9e9" || color === "#a633ea";

    // Poly tail
    const tailBase1X = tail.x - (thickness*tailTaper), tailBase1Y = tail.y - (thickness*tailTaper*0.25);
    const tailBase2X = tail.x + (thickness*tailTaper), tailBase2Y = tail.y + (thickness*tailTaper*0.25);

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
          const t = 0.12 + 0.72 * (bandIdx / 6); // Spread along length
          // Offset slightly by band for more organic effect
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
              fillOpacity={ color === "#a633ea" ? 0.32 : 0.4 }
              stroke="none"
              opacity={0.86}
              transform={`rotate(${(bandIdx%2)*24 - 10},${x},${y})`}
            />
          );
        })}
        {/* Light edge highlight on snake's back */}
        <path
          d={bodyPath}
          stroke="#fff6"
          strokeWidth={thickness*0.21}
          fill="none"
          strokeLinecap="round"
          style={{
            filter: color === "#33a852" ? "blur(0.5px)" : "",
            opacity: 0.7,
            mixBlendMode: "screen"
          }}
        />
        {/* Snake head */}
        <SnakeHead x={head.x} y={head.y} angle={angle} color={color} tileSize={TILE_SIZE} />
        {/* SHARP, LONG, TAPERED TAIL (SVG polygon, ultra-thin per image) */}
        <polygon
          points={`
            ${tailBase1X},${tailBase1Y}
            ${tailBase2X},${tailBase2Y}
            ${tailTipX},${tailTipY}
          `}
          fill={color}
          opacity={0.89}
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
