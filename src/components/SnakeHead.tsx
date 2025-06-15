
import React from "react";

interface SnakeHeadProps {
  x: number;
  y: number;
  angle: number;
  color: string;
  tileSize: number;
}

/**
 * Stylized snake head SVG for Snakes & Ladders,
 * With shape and facial features inspired by sample images.
 * Green, blue: round-oval head. Purple: more triangular head.
 */
const SnakeHead = ({ x, y, angle, color, tileSize }: SnakeHeadProps) => {
  // Variant for blue/purple/green: match ref
  const rounded = color === "#33a852" || color === "#12a9e9" || color === "#fac03c";
  const isBlue = color === "#12a9e9";
  const isPurple = color === "#a633ea";
  const size = tileSize * 0.8;
  // Head shape: 
  // Green & blue: oval / teardrop
  // Purple: "diamond"/triangle
  let headShape;
  if (isPurple) {
    // Diamond/triangle
    headShape = (
      <path
        d={`
          M 0 ${-size*0.27}
          Q ${size*0.16} ${-size*0.06} ${size*0.14} ${size*0.13}
          Q 0 ${size*0.27} ${-size*0.14} ${size*0.13}
          Q ${-size*0.16} ${-size*0.06} 0 ${-size*0.27}
        `}
        fill={color}
        stroke="#232323"
        strokeWidth="2"
      />
    );
  } else {
    // Teardrop/pointed-oval, longer for blue/yellow
    headShape = (
      <ellipse
        cx="0"
        cy={isBlue ? (-size * 0.12) : 0}
        rx={size * (isBlue ? 0.25 : 0.2)}
        ry={size * (isBlue ? 0.37 : 0.27)}
        fill={color}
        stroke="#232323"
        strokeWidth="2"
      />
    );
  }

  // Eyes (wide apart, white, large, round)
  const eyeRX = size * 0.061;
  const eyeRY = size * 0.072;
  const leftEyeY = isPurple ? -size*0.11 : -size*0.14;
  const rightEyeY = leftEyeY;
  const leftEyeX = -size * (isPurple ? 0.12 : 0.115);
  const rightEyeX = size * (isPurple ? 0.12 : 0.115);

  // Pupil (smaller dot, upper part of eye)
  const pupilOffsetY = isPurple ? -size*0.018 : -size*0.024;
  const pupilRX = size * 0.023;
  const pupilRY = size * 0.023;

  // Nostrils—very small, almost invisible—like the images, omit if blue
  const nostrilRX = size * 0.013, nostrilRY = size * 0.018;

  // Mouth: simple, short, not angry; straight or slight smile. 
  const mouth = (
    <path
      d={`
        M ${-size*0.055} ${size*0.13}
        Q 0 ${size*0.14} ${size*0.055} ${size*0.13}
      `}
      fill="none"
      stroke="#232323"
      strokeWidth="2"
      strokeLinecap="round"
    />
  );

  // Tongue: wavy, forked, light pink-red
  const tongueLen = size*0.38;
  const tongue = (
    <g>
      <path
        d={`
          M 0 ${size*0.25}
          q ${-size*0.013} ${tongueLen*0.31} 0 ${tongueLen*0.48}
          q ${size*0.011} ${tongueLen*0.21} ${size*0.022} ${tongueLen*0.44}
        `}
        fill="none"
        stroke="#e35555"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Forked tip */}
      <path
        d={`M 0 ${size*0.25 + tongueLen*0.92} q ${-size*0.02} ${size*0.03} 0 ${size*0.06}`}
        fill="none"
        stroke="#e35555"
        strokeWidth="1.2"
      />
      <path
        d={`M 0 ${size*0.25 + tongueLen*0.92} q ${size*0.02} ${size*0.03} 0 ${size*0.06}`}
        fill="none"
        stroke="#e35555"
        strokeWidth="1.2"
      />
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {headShape}
      {/* Eyes */}
      <ellipse cx={leftEyeX} cy={leftEyeY} rx={eyeRX} ry={eyeRY} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={rightEyeX} cy={rightEyeY} rx={eyeRX} ry={eyeRY} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={leftEyeX} cy={leftEyeY + pupilOffsetY} rx={pupilRX} ry={pupilRY} fill="#232323"/>
      <ellipse cx={rightEyeX} cy={rightEyeY + pupilOffsetY} rx={pupilRX} ry={pupilRY} fill="#232323"/>
      {/* Nostrils (skip for blue) */}
      {!isBlue && (
        <>
          <ellipse cx={-size*0.045} cy={size*0.04} rx={nostrilRX} ry={nostrilRY} fill="#232323" opacity="0.35"/>
          <ellipse cx={size*0.045} cy={size*0.04} rx={nostrilRX} ry={nostrilRY} fill="#232323" opacity="0.35"/>
        </>
      )}
      {/* Mouth */}
      {mouth}
      {/* Tongue, beneath/centered */}
      {tongue}
    </g>
  );
};

export default SnakeHead;
