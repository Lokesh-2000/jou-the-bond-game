import React from "react";
import SnakeHead from "./SnakeHead";
import { TILE_SIZE, tileToXY, cubicBezier, cubicBezierDeriv } from "../utils/snakeMath";

// SNAKES config stays unchanged for color/tiles. Note: paths can take optional offset.
const SNAKES = [
  { from: 38, to: 15, color: '#33a852' },   // green
  { from: 47, to: 19, color: '#a633ea', pathOffset: { headX: -8, headY: 10 } },   // purple
  { from: 53, to: 31, color: '#12a9e9', pathOffset: { headX: 18, headY: -18 } },  // blue
  { from: 62, to: 55, color: '#fac03c' },   // yellow
  { from: 86, to: 54, color: '#fd3577' },   // pink/red
  { from: 88, to: 24, color: '#12a9e9' },   // blue
  { from: 92, to: 70, color: '#33a852' },   // green
  { from: 94, to: 6,  color: '#a633ea' },   // purple
  { from: 97, to: 78, color: '#fac03c' },   // yellow
  { from: 82, to: 65, color: '#fd3577' },   // pink
  { from: 29, to: 8,  color: '#33a852' },   // green
];

// Make all snake bodies the same thickness and shape: playful S curves!
const BODY_THICKNESS = TILE_SIZE * 0.75;

const tailTaper = 0.3; // thickness at tail = 0.3x body
const headScale = 1.2; // head = 1.2x body

const S_CURVE_SPLIT = 0.5; // Split S curve into two Beziers for super-smoothness

function makeSControlPoints(from, to, s = 0.5, curvature = TILE_SIZE*1.2, alt = false) {
  // Returns two control points (mid1, mid2) to achieve a classic S.
  // "alt" flips the curve to avoid overlap in crowded snakes.
  // The S shape should look traditional—middle "wiggle" and smooth lines.
  const dx = to.x - from.x, dy = to.y - from.y, dist = Math.sqrt(dx*dx + dy*dy);

  // S-curve wiggle: offset normal to (dx, dy)
  const normx = -dy / dist, normy = dx / dist;
  const wiggle = curvature * (alt ? -1 : 1);

  // Two inflection points along the path
  const mid1 = {
    x: from.x + dx * s * 0.4 + normx * wiggle,
    y: from.y + dy * s * 0.4 + normy * wiggle,
  };
  const mid2 = {
    x: from.x + dx * s * 1.2 - normx * wiggle,
    y: from.y + dy * s * 1.2 - normy * wiggle,
  };
  return [mid1, mid2];
}

const SnakeOverlay = () => {
  function renderSnake({ from, to, color, pathOffset }: typeof SNAKES[number], idx: number) {
    // Get head/tail in px, optionally apply slight manual offset for overlap/clarity
    let head = tileToXY(from);
    let tail = tileToXY(to);
    if (pathOffset) {
      head = { x: head.x + pathOffset.headX, y: head.y + pathOffset.headY };
    }

    // S shape: use classic smooth "S" by splitting into two beziers (two wiggles)
    const alt = idx % 2 === 1; // Alternate curve direction for overlap
    const curvature = TILE_SIZE * (idx % 3 === 0 ? 1.12 : 1.33); // Slight variety
    const split = S_CURVE_SPLIT;
    const mid = {
      x: head.x + (tail.x - head.x) * split,
      y: head.y + (tail.y - head.y) * split,
    };
    const [ctrl1, ctrl2a] = makeSControlPoints(head, mid, split * 1, curvature, alt);
    const [ctrl2b, ctrl3] = makeSControlPoints(mid, tail, split * 1, curvature * 0.97, !alt);

    // Build multi-bezier S-path
    const bodyPath = `
      M ${head.x} ${head.y}
      C ${ctrl1.x} ${ctrl1.y} ${ctrl2a.x} ${ctrl2a.y} ${mid.x} ${mid.y}
      C ${ctrl2b.x} ${ctrl2b.y} ${ctrl3.x} ${ctrl3.y} ${tail.x} ${tail.y}
    `;

    // Find tangent at head for head angle
    // Use cubicBezierDeriv for start of first curve (t ~ 0.05), slightly into S
    const t = 0.06;
    const dx =
      3 * (ctrl1.x - head.x) * (1 - t) * (1 - t) +
      6 * (ctrl2a.x - ctrl1.x) * (1 - t) * t +
      3 * (mid.x - ctrl2a.x) * t * t;
    const dy =
      3 * (ctrl1.y - head.y) * (1 - t) * (1 - t) +
      6 * (ctrl2a.y - ctrl1.y) * (1 - t) * t +
      3 * (mid.y - ctrl2a.y) * t * t;

    const headAngle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Tail taper: extend past tail, draw a short, narrow segment for the point
    const tailVec = {
      x: tail.x - ctrl3.x,
      y: tail.y - ctrl3.y
    };
    const norm = Math.sqrt(tailVec.x * tailVec.x + tailVec.y * tailVec.y);
    const tailExt = {
      x: tail.x + (tailVec.x / norm) * TILE_SIZE * 0.22,
      y: tail.y + (tailVec.y / norm) * TILE_SIZE * 0.22,
    };

    // HEAD: draw *after* body so it overlaps
    // TAIL: fine point, smaller/thinner

    // Add fun stripes for green/purple/blue types (classic style)
    const bandColors = {
      "#33a852": "#11953c",
      "#12a9e9": "#48ffe1",
      "#a633ea": "#ef40cd",
    };
    const hasBands = !!bandColors[color];

    // BODY bands: 5 stripes, elliptical, fade toward tail; all same thickness, color overlays
    const bandCount = 5;
    const bands = hasBands
      ? Array.from({ length: bandCount }, (_, bandIdx) => {
          // Bands placed at t along both curves (blend)
          const tMain = 0.16 + 0.7 * (bandIdx / (bandCount - 1));
          // Find which Bezier
          let tBezier, p;
          if (tMain < split) {
            // First curve
            tBezier = tMain / split;
            p = {
              x: cubicBezier(head.x, ctrl1.x, ctrl2a.x, mid.x, tBezier),
              y: cubicBezier(head.y, ctrl1.y, ctrl2a.y, mid.y, tBezier),
            };
          } else {
            // Second curve
            tBezier = (tMain - split) / (1 - split);
            p = {
              x: cubicBezier(mid.x, ctrl2b.x, ctrl3.x, tail.x, tBezier),
              y: cubicBezier(mid.y, ctrl2b.y, ctrl3.y, tail.y, tBezier),
            };
          }
          // Band shape
          return (
            <ellipse
              key={bandIdx}
              cx={p.x}
              cy={p.y}
              rx={BODY_THICKNESS * 0.21}
              ry={BODY_THICKNESS * 0.085}
              fill={bandColors[color]}
              fillOpacity={0.23 + 0.09 * (1 - bandIdx / bandCount)}
              stroke="none"
              opacity={0.93}
              transform={`rotate(${(alt?-1:1)*(bandIdx%2)*24-12},${p.x},${p.y})`}
            />
          );
        })
      : null;

    // Silhouette/body
    return (
      <g key={`snake${idx}`}>
        {/* Body shadow */}
        <path
          d={bodyPath}
          stroke="#0003"
          strokeWidth={BODY_THICKNESS * 1.13}
          fill="none"
          strokeLinecap="round"
          filter="drop-shadow(0 2px 8px #0003)"
        />
        {/* Snake body (main) */}
        <path
          d={bodyPath}
          stroke={color}
          strokeWidth={BODY_THICKNESS}
          fill="none"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 2px 8px #0002)",
          }}
        />
        {/* Optional bands/stripes */}
        {bands}
        {/* Back highlight */}
        <path
          d={bodyPath}
          stroke="#fff6"
          strokeWidth={BODY_THICKNESS * 0.16}
          fill="none"
          strokeLinecap="round"
          opacity={0.37}
        />
        {/* Tail: draw last segment extra thin for tapered point */}
        <path
          d={`
            M ${tail.x} ${tail.y}
            L ${tailExt.x} ${tailExt.y}
          `}
          stroke={color}
          strokeWidth={BODY_THICKNESS * tailTaper}
          fill="none"
          strokeLinecap="round"
          opacity={0.93}
        />
        {/* Tail's roundness—ellipse at very tip */}
        <ellipse
          cx={tailExt.x}
          cy={tailExt.y}
          rx={BODY_THICKNESS * 0.09}
          ry={BODY_THICKNESS * 0.15}
          fill={color}
          opacity={0.8}
        />
        {/* Snake head (should overlap body) */}
        <SnakeHead
          x={head.x}
          y={head.y}
          angle={headAngle}
          color={color}
          tileSize={BODY_THICKNESS * headScale}
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
