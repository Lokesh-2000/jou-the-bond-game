
import React from "react";

// Ladders (bottom → top)
const LADDERS = [
  { from: 5, to: 58 },
  { from: 9, to: 27 },
  { from: 33, to: 87 },
  { from: 40, to: 64 },
  { from: 57, to: 73 },
  { from: 63, to: 81 },
  { from: 75, to: 93 },
];

const TILE_SIZE = 64;

// Helper: get center of a tile
function tileToXY(tileNum: number) {
  const n = tileNum - 1;
  const row = Math.floor(n / 10);
  let col = n % 10;
  if (row % 2 === 1) col = 9 - col;
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: (9 - row) * TILE_SIZE + TILE_SIZE / 2,
  };
}

const LadderOverlay = () => {
  const wood = "#9B6830";
  const woodDark = "#5B3E16";

  function renderLadder({ from, to }: { from: number; to: number }, i: number) {
    const start = tileToXY(from);
    const end = tileToXY(to);

    // Vector along ladder
    const dx = end.x - start.x,
      dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Ladder params
    const width = TILE_SIZE * 0.54;
    const rungs = 7;
    const rungStep = 1 / (rungs - 1);

    // Orthogonal (perp) unit vector
    const perp = { x: -dy / len, y: dx / len };

    // Side rails
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

    // Shadow offset
    const shadowOffset = TILE_SIZE * 0.11;

    // Draw
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
            strokeWidth={TILE_SIZE * 0.13}
            strokeLinecap="round"
          />
          <line
            x1={rightStart.x + shadowOffset}
            y1={rightStart.y + shadowOffset}
            x2={rightEnd.x + shadowOffset}
            y2={rightEnd.y + shadowOffset}
            stroke="#222"
            strokeWidth={TILE_SIZE * 0.13}
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
          strokeWidth={TILE_SIZE * 0.13}
          strokeLinecap="round"
        />
        <line
          x1={rightStart.x}
          y1={rightStart.y}
          x2={rightEnd.x}
          y2={rightEnd.y}
          stroke={wood}
          strokeWidth={TILE_SIZE * 0.13}
          strokeLinecap="round"
        />
        {/* Edge highlight */}
        <line
          x1={leftStart.x}
          y1={leftStart.y}
          x2={leftEnd.x}
          y2={leftEnd.y}
          stroke="#eac192"
          strokeWidth={TILE_SIZE * 0.03}
          strokeLinecap="round"
        />
        <line
          x1={rightStart.x}
          y1={rightStart.y}
          x2={rightEnd.x}
          y2={rightEnd.y}
          stroke="#eac192"
          strokeWidth={TILE_SIZE * 0.03}
          strokeLinecap="round"
        />
        {/* Ladder rungs */}
        {Array.from({ length: rungs }).map((_, idx) => {
          const px =
            start.x + dx * rungStep * idx;
          const py =
            start.y + dy * rungStep * idx;
          const rungHalf = {
            x: perp.x * (width * 0.44),
            y: perp.y * (width * 0.44),
          };
          return (
            <line
              key={`ladder${i}-rung${idx}`}
              x1={px - rungHalf.x}
              y1={py - rungHalf.y}
              x2={px + rungHalf.x}
              y2={py + rungHalf.y}
              stroke={woodDark}
              strokeWidth={TILE_SIZE * 0.09}
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
