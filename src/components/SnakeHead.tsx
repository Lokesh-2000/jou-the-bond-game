
import React from "react";

interface SnakeHeadProps {
  x: number;
  y: number;
  angle: number;
  color: string;
  tileSize: number;
}

/**
 * SnakeHead styled after provided reference image:
 * - Head is a wide oval with a soft curve at bottom (almost circular)
 * - Only one (large) eye, left/top side, and pink-red tongue at lower center, NO visible mouth
 * - Tongue emerges from bottom of head, not forehead
 * - Matches style: bold, simple highlights, flat banding is handled on body not head
 */
const SnakeHead = ({ x, y, angle, color, tileSize }: SnakeHeadProps) => {
  const size = tileSize * 0.82;

  // Head: wide oval, more circular and a little flattened to match image ref
  const headShape = (
    <ellipse
      cx="0"
      cy="0"
      rx={size * 0.25}
      ry={size * 0.23}
      fill={color}
      stroke="#232323"
      strokeWidth="2"
    />
  );

  // Eye (large, only one visible on top/left, matching image): placed at upper left, white circle
  const eyeCX = -size * 0.08;
  const eyeCY = -size * 0.09;
  const eyeR = size * 0.073;
  // Pupil (off-center, up and left) - as shown in image
  const pupilCX = eyeCX - size * 0.018;
  const pupilCY = eyeCY - size * 0.011;
  const pupilR = size * 0.028;

  const eyeGroup = (
    <g>
      <ellipse cx={eyeCX} cy={eyeCY} rx={eyeR} ry={eyeR * 1.02} fill="#fff" stroke="#222" strokeWidth={size*0.018} />
      <ellipse cx={pupilCX} cy={pupilCY} rx={pupilR} ry={pupilR * 1.06} fill="#232323" />
    </g>
  );

  // No mouth (as per instruction)
  // Tongue: emerges from bottom center of head, slightly forked and wavy.
  // Angle: tongue points DOWN from head, with tiny fork
  const tongueLen = size * 0.38;
  const tongueBaseY = size * 0.20;
  const tongue = (
    <g>
      <path
        d={`
          M 0 ${tongueBaseY}
          q ${-size*0.011} ${tongueLen*0.18} 0 ${tongueLen*0.48}
          q ${size*0.012} ${tongueLen*0.23} ${size*0.023} ${tongueLen*0.42}
        `}
        fill="none"
        stroke="#e35555"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Forked tip */}
      <path
        d={`M 0 ${tongueBaseY + tongueLen * 0.89} q ${-size*0.018} ${size*0.027} 0 ${size*0.049}`}
        fill="none"
        stroke="#e35555"
        strokeWidth="1.1"
      />
      <path
        d={`M 0 ${tongueBaseY + tongueLen * 0.89} q ${size*0.018} ${size*0.027} 0 ${size*0.049}`}
        fill="none"
        stroke="#e35555"
        strokeWidth="1.1"
      />
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {headShape}
      {eyeGroup}
      {tongue}
    </g>
  );
};

export default SnakeHead;

