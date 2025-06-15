
import React from "react";
import { TILE_SIZE, tileToCorner } from "../utils/ladderMath";

// Updated ladder positions (75-93 ➔ 76-84)
const LADDERS = [
  { from: 5, to: 58 },
  { from: 9, to: 27 },
  { from: 33, to: 87 },
  { from: 40, to: 64 },
  { from: 51, to: 73 },
  { from: 61, to: 81 },
  { from: 76, to: 84 }, // changed here
];

const LadderOverlay = () => {
  const wood = "#9B6830";
  const woodDark = "#5B3E16";

  function renderLadder({ from, to }: { from: number; to: number }, i: number) {
    // Center of tile
    const centerOffset = TILE_SIZE * 0.5;

    // Ladder endpoints: slightly above center at bottom, slightly below at top
    // "bottom" is always min(from, to)
    const isUp = to > from;
    const startTile = isUp ? from : to;
    const endTile = isUp ? to : from;
    // Offset: bottom endpoint above center, top endpoint below center
    const startCorner = tileToCorner(startTile, "bl");
    const endCorner = tileToCorner(endTile, "tr");

    const bottom = {
      x: startCorner.x,
      y: startCorner.y - TILE_SIZE * 0.12,
    };
    const top = {
      x: endCorner.x,
      y: endCorner.y + TILE_SIZE * 0.13,
    };
    // If ladder is reversed (rare), invert
    const base = isUp ? bottom : top;
    const tip = isUp ? top : bottom;

    const dx = tip.x - base.x,
      dy = tip.y - base.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    const width = TILE_SIZE * 0.46;  // thinner rails
    const rungs = 16; // more rungs
    const rungStep = 1 / (rungs - 1);

    const perp = { x: -dy / len, y: dx / len };

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

    const shadowOffset = TILE_SIZE * 0.08;

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
        {/* Ladder rungs */}
        {Array.from({ length: rungs }).map((_, idx) => {
          const px = base.x + dx * rungStep * idx;
          const py = base.y + dy * rungStep * idx;
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
