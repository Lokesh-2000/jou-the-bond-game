
import React from "react";
import { TILE_SIZE, tileToCorner } from "../utils/ladderMath";

// All ladders use same rung spacing, and ladder from 76→84 uses fewer rungs.
const LADDERS = [
  { from: 5, to: 58 },
  { from: 9, to: 27 },
  { from: 33, to: 87 },
  { from: 40, to: 64 },
  { from: 51, to: 73 },
  { from: 61, to: 81 },
  { from: 76, to: 84 }, // Short ladder, use less rungs
];

const LadderOverlay = () => {
  const wood = "#9B6830";
  const woodDark = "#5B3E16";

  // Ladders uniformly spaced, both ends inside tiles
  function renderLadder({ from, to }: { from: number; to: number }, i: number) {
    // Offset for all ladders so ends well inside tiles:
    const ladderInset = TILE_SIZE * 0.25; // move endpoints away from tile border

    // Find base/tip corners (use tile centers for inside effect)
    const n = (n: number) => n - 1;
    const rowcol = (tileNum: number) => {
      const row = Math.floor(n(tileNum) / 10);
      let col = n(tileNum) % 10;
      if (row % 2 === 1) col = 9 - col;
      return { row, col };
    };
    const centerOfTile = (tileNum: number) => {
      const { row, col } = rowcol(tileNum);
      return {
        x: col * TILE_SIZE + TILE_SIZE / 2,
        y: (9 - row) * TILE_SIZE + TILE_SIZE / 2,
      };
    };

    const startPos = centerOfTile(from);
    const endPos = centerOfTile(to);

    // Move base/tip inside the tile by scaling the vector
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    // New endpoints inside the tiles using ladderInset
    const base = {
      x: startPos.x + (dx * ladderInset) / len,
      y: startPos.y + (dy * ladderInset) / len,
    };
    const tip = {
      x: endPos.x - (dx * ladderInset) / len,
      y: endPos.y - (dy * ladderInset) / len,
    };

    // Recompute dx/dy/length for new endpoints
    const ddx = tip.x - base.x, ddy = tip.y - base.y;
    const dlen = Math.sqrt(ddx * ddx + ddy * ddy);

    const width = TILE_SIZE * 0.46;
    // Rungs: short ladders (like 76-84) = less, else all same and even spacing
    const rungs = (from === 76 && to === 84) ? 7 : 12;
    const rungStep = 1 / (rungs - 1);

    const perp = { x: -ddy / dlen, y: ddx / dlen };

    const leftStart = {
      x: base.x + perp.x * width * 0.5,
      y: base.y + perp.y * width * 0.5,
    };
    const leftEnd = {
      x: tip.x + perp.x * width * 0.5,
      y: tip.y + perp.y * width * 0.5,
    };
    const rightStart = {
      x: base.x - perp.x * width * 0.5,
      y: base.y - perp.y * width * 0.5,
    };
    const rightEnd = {
      x: tip.x - perp.x * width * 0.5,
      y: tip.y - perp.y * width * 0.5,
    };

    const shadowOffset = TILE_SIZE * 0.06;

    return (
      <g key={`ladder${i}`}>
        {/* Ladder shadow */}
        <g opacity={0.16}>
          <line
            x1={leftStart.x + shadowOffset}
            y1={leftStart.y + shadowOffset}
            x2={leftEnd.x + shadowOffset}
            y2={leftEnd.y + shadowOffset}
            stroke="#222"
            strokeWidth={TILE_SIZE * 0.09}
            strokeLinecap="round"
          />
          <line
            x1={rightStart.x + shadowOffset}
            y1={rightStart.y + shadowOffset}
            x2={rightEnd.x + shadowOffset}
            y2={rightEnd.y + shadowOffset}
            stroke="#222"
            strokeWidth={TILE_SIZE * 0.09}
            strokeLinecap="round"
          />
        </g>
        {/* Rails */}
        <line
          x1={leftStart.x}
          y1={leftStart.y}
          x2={leftEnd.x}
          y2={leftEnd.y}
          stroke={wood}
          strokeWidth={TILE_SIZE * 0.09}
          strokeLinecap="round"
        />
        <line
          x1={rightStart.x}
          y1={rightStart.y}
          x2={rightEnd.x}
          y2={rightEnd.y}
          stroke={wood}
          strokeWidth={TILE_SIZE * 0.09}
          strokeLinecap="round"
        />
        {/* Edge highlight */}
        <line
          x1={leftStart.x}
          y1={leftStart.y}
          x2={leftEnd.x}
          y2={leftEnd.y}
          stroke="#eac192"
          strokeWidth={TILE_SIZE * 0.02}
          strokeLinecap="round"
        />
        <line
          x1={rightStart.x}
          y1={rightStart.y}
          x2={rightEnd.x}
          y2={rightEnd.y}
          stroke="#eac192"
          strokeWidth={TILE_SIZE * 0.02}
          strokeLinecap="round"
        />
        {/* Ladder rungs: Evenly spaced between base and tip */}
        {Array.from({ length: rungs }).map((_, idx) => {
          const px = base.x + ddx * rungStep * idx;
          const py = base.y + ddy * rungStep * idx;
          const rungHalf = {
            x: perp.x * (width * 0.38),
            y: perp.y * (width * 0.38),
          };
          return (
            <line
              key={`ladder${i}-rung${idx}`}
              x1={px - rungHalf.x}
              y1={py - rungHalf.y}
              x2={px + rungHalf.x}
              y2={py + rungHalf.y}
              stroke={woodDark}
              strokeWidth={TILE_SIZE * 0.048}
              strokeLinecap="round"
              filter="drop-shadow(0 1px 1px #fff1)"
            />
          );
        })}
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
        zIndex: 7,
      }}
      viewBox={`0 0 ${TILE_SIZE * 10} ${TILE_SIZE * 10}`}
    >
      {LADDERS.map(renderLadder)}
    </svg>
  );
};

export default LadderOverlay;

