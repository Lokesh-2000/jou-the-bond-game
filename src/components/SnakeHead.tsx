
import React from "react";

interface SnakeHeadProps {
  x: number;
  y: number;
  angle: number;
  color: string;
  tileSize: number;
}

/**
 * Classic cartoon SnakeHead for Snakes & Ladders: bold oval, big eye, forked tongue.
 * - Wide, round head slightly larger than body.
 * - Large, expressive eye (slight glint highlight), friendly look.
 * - Forked tongue at mouth, below centerline.
 */
const SnakeHead = ({ x, y, angle, color, tileSize }: SnakeHeadProps) => {
  const size = tileSize; // tileSize is already body*1.2
  // Head shape: oval (slightly flattened below), bold outline
  const headW = size * 0.63;
  const headH = size * 0.55;

  // Eye: big, top left, with white highlight
  const eyeCX = -size * 0.13;
  const eyeCY = -size * 0.15;
  const eyeR = size * 0.11;
  // Pupil sits slightly up/left
  const pupilCX = eyeCX - size * 0.026;
  const pupilCY = eyeCY - size * 0.019;
  const pupilR = size * 0.046;

  // Tongue: simple fork, pops below mouth (bottom mid)
  const tongueBaseY = headH * 0.42;
  const tongueLen = size * 0.37;
  const tongueFork = size * 0.045;

  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {/* Head (main oval) */}
      <ellipse
        cx={0}
        cy={0}
        rx={headW / 2}
        ry={headH / 2}
        fill={color}
        stroke="#232323"
        strokeWidth={size * 0.06}
      />
      {/* Eye */}
      <g>
        <ellipse
          cx={eyeCX}
          cy={eyeCY}
          rx={eyeR}
          ry={eyeR}
          fill="#fff"
          stroke="#232323"
          strokeWidth={size * 0.018}
        />
        <ellipse
          cx={pupilCX}
          cy={pupilCY}
          rx={pupilR}
          ry={pupilR * 1.05}
          fill="#232323"
        />
        {/* Eye highlight */}
        <ellipse
          cx={eyeCX - eyeR * 0.3}
          cy={eyeCY - eyeR * 0.32}
          rx={eyeR * 0.27}
          ry={eyeR * 0.12}
          fill="#fff"
          opacity={0.7}
        />
      </g>
      {/* Forked tongue */}
      <g>
        {/* Main tongue (out from below head, wavy) */}
        <path
          d={`
            M 0 ${tongueBaseY}
            q ${-tongueFork/3} ${tongueLen*0.19} 0 ${tongueLen*0.51}
            q ${tongueFork/3} ${tongueLen*0.18} ${tongueFork} ${tongueLen*0.29}
          `}
          fill="none"
          stroke="#e35555"
          strokeWidth={size*0.05}
          strokeLinecap="round"
        />
        {/* Forks */}
        <path
          d={`M 0 ${tongueBaseY + tongueLen * 0.92} q ${-tongueFork} ${tongueFork*0.9} 0 ${tongueFork*1.75}`}
          fill="none"
          stroke="#e35555"
          strokeWidth={size*0.026}
        />
        <path
          d={`M 0 ${tongueBaseY + tongueLen * 0.92} q ${tongueFork} ${tongueFork*0.9} 0 ${tongueFork*1.75}`}
          fill="none"
          stroke="#e35555"
          strokeWidth={size*0.026}
        />
      </g>
    </g>
  );
};

export default SnakeHead;

