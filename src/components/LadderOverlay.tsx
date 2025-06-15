
import React from "react";
import { useSpecialTiles } from "./hooks/useSpecialTiles";
import { tileToCorner } from "../utils/ladderMath";

// Draw a stylized ladder with consistent rung spacing between 2 tiles
function drawLadder(from: number, to: number, color: string) {
  const bottom = tileToCorner(from, "bl");
  const top = tileToCorner(to, "tl");
  // Main rails, left & right
  const railsSpacing = 22;
  const rungCount = 5; // fixed for all ladders
  // Rails
  const leftRail = { x1: bottom.x - railsSpacing, y1: bottom.y, x2: top.x - railsSpacing, y2: top.y };
  const rightRail = { x1: bottom.x + railsSpacing, y1: bottom.y, x2: top.x + railsSpacing, y2: top.y };
  // Rungs
  const rungs = [];
  for (let i = 0; i < rungCount; i++) {
    const t = i / (rungCount - 1);
    const xL = leftRail.x1 + (leftRail.x2 - leftRail.x1) * t;
    const yL = leftRail.y1 + (leftRail.y2 - leftRail.y1) * t;
    const xR = rightRail.x1 + (rightRail.x2 - rightRail.x1) * t;
    const yR = rightRail.y1 + (rightRail.y2 - rightRail.y1) * t;
    rungs.push(
      <line
        key={i}
        x1={xL}
        y1={yL}
        x2={xR}
        y2={yR}
        stroke="#995ae5"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
    );
  }
  return (
    <>
      <line {...leftRail} stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.80"/>
      <line {...rightRail} stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.80"/>
      {rungs}
    </>
  );
}

const LadderOverlay = () => {
  const { ladders } = useSpecialTiles();
  return (
    <svg width={640} height={640} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 7 }}>
      {Object.entries(ladders).map(([from, to], idx) =>
        <g key={from + "" + to}>
          {drawLadder(Number(from), Number(to), "#995ae5")}
        </g>
      )}
    </svg>
  );
};

export default LadderOverlay;
