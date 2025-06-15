
import React from "react";
import { TILE_SIZE, tileToCorner } from "../utils/ladderMath";

// Ladders (updated positions)
const LADDERS = [
  { from: 5, to: 58 },
  { from: 9, to: 27 },
  { from: 33, to: 87 },
  { from: 40, to: 64 },
  { from: 51, to: 73 },
  { from: 61, to: 81 },
  { from: 75, to: 93 },
];

const LadderOverlay = () => {
  const wood = "#9B6830";
  const woodDark = "#5B3E16";

  function renderLadder({ from, to }: { from: number; to: number }, i: number) {
    // Adjust ladder endpoints: 
    // Bottom goes slightly above the center of the bottom tile
    // Top ends slightly below the center of the top tile
    // We'll use the center of the tile and apply a small vertical offset

    // Center of "from" tile (bottom of ladder)
    const fromCenter = {
      x: (( ( (from-1) % 10) + ((Math.floor((from-1)/10) % 2 === 1) ? 9 - 2*( (from-1) % 10 ) : 0)) * TILE_SIZE ) + TILE_SIZE/2,
      y: (9 - Math.floor((from-1)/10)) * TILE_SIZE + TILE_SIZE/2
    };
    // Center of "to" tile (top of ladder)
    const toCenter = {
      x: (( ( (to-1) % 10) + ((Math.floor((to-1)/10) % 2 === 1) ? 9 - 2*( (to-1) % 10 ) : 0)) * TILE_SIZE ) + TILE_SIZE/2,
      y: (9 - Math.floor((to-1)/10)) * TILE_SIZE + TILE_SIZE/2
    };
    // Up vector (ladder runs bottom up: dy negative)
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const length = Math.sqrt(dx*dx + dy*dy);
    // Offset for bottom above center (move up)
    const start = {
      x: fromCenter.x + dx * 0.07,
      y: fromCenter.y + dy * 0.07 - Math.sign(dy) * TILE_SIZE * 0.14
    };
    // Offset for top below center (move down)
    const end = {
      x: toCenter.x - dx * 0.07,
      y: toCenter.y - dy * 0.07 + Math.sign(dy) * TILE_SIZE * 0.14
    };

    // Ladder width/thickness reduced
    const width = TILE_SIZE * 0.36;
    const rungs = 10;
    const rungStep = 1 / (rungs - 1);

    const localDx = end.x - start.x;
    const localDy = end.y - start.y;
    const localLen = Math.sqrt(localDx * localDx + localDy * localDy);

    const perp = { x: -localDy / localLen, y: localDx / localLen };

    const leftStart = {
      x: start.x + perp.x * width * 0.5,
      y: start.y + perp.y * width * 0.5,
    };
    const leftEnd = {
      x: end.x + perp.x * width * 0.5,
      y: end.y + perp.y * width * 0.5,
    };
    const rightStart = {
      x: start.x - perp.x * width * 0.5,
      y: start.y - perp.y * width * 0.5,
    };
    const rightEnd = {
      x: end.x - perp.x * width * 0.5,
      y: end.y - perp.y * width * 0.5,
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
          strokeWidth={TILE_SIZE * 0.018}
          strokeLinecap="round"
        />
        <line
          x1={rightStart.x}
          y1={rightStart.y}
          x2={rightEnd.x}
          y2={rightEnd.y}
          stroke="#eac192"
          strokeWidth={TILE_SIZE * 0.018}
          strokeLinecap="round"
        />
        {/* Ladder rungs */}
        {Array.from({ length: rungs }).map((_, idx) => {
          const px = start.x + localDx * rungStep * idx;
          const py = start.y + localDy * rungStep * idx;
          const rungHalf = {
            x: perp.x * (width * 0.34),
            y: perp.y * (width * 0.34),
          };
          return (
            <line
              key={`ladder${i}-rung${idx}`}
              x1={px - rungHalf.x}
              y1={py - rungHalf.y}
              x2={px + rungHalf.x}
              y2={py + rungHalf.y}
              stroke={woodDark}
              strokeWidth={TILE_SIZE * 0.053}
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
