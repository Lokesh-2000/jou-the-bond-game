
import React from "react";

interface SnakeHeadProps {
  x: number;
  y: number;
  angle: number;
  color: string;
  tileSize: number;
}

/**
 * Oval, stylized snake head SVG with "slightly angry" look,
 * NO nostrils or eyebrows. Tongue points opposite the head's angle (toward board tile number).
 */
const SnakeHead = ({ x, y, angle, color, tileSize }: SnakeHeadProps) => {
  const size = tileSize * 0.8;

  // Head: Single oval, centered, regardless of color now
  const headShape = (
    <ellipse
      cx="0"
      cy="0"
      rx={size * 0.22}
      ry={size * 0.29}
      fill={color}
      stroke="#232323"
      strokeWidth="2"
    />
  );

  // Eyes: Ovals, angled slightly inward for "angry" look
  // Angle the eye-groups towards each other with a small skew
  const eyeRX = size * 0.059;
  const eyeRY = size * 0.067;
  const eyeY = -size * 0.13;
  const eyeXSep = size * 0.12;

  // "Angry" eyes: draw eyes as ovals, but pupils off-center and group rotated toward each other
  // Slightly rotate the white part and more tilt/offset on pupil
  const leftEyeGroup = (
    <g transform={`translate(${-eyeXSep},${eyeY}) rotate(-16)`}>
      <ellipse rx={eyeRX} ry={eyeRY} fill="#fff" stroke="#222" strokeWidth="1"/>
      {/* Pupil: move up and inward for 'angry' look */}
      <ellipse cx={-eyeRX*0.27} cy={-eyeRY*0.24} rx={size*0.022} ry={size*0.025} fill="#232323" />
    </g>
  );
  const rightEyeGroup = (
    <g transform={`translate(${eyeXSep},${eyeY}) rotate(16)`}>
      <ellipse rx={eyeRX} ry={eyeRY} fill="#fff" stroke="#222" strokeWidth="1"/>
      {/* Pupil: move up and inward for 'angry' look */}
      <ellipse cx={eyeRX*0.27} cy={-eyeRY*0.24} rx={size*0.022} ry={size*0.025} fill="#232323" />
    </g>
  );

  // Mouth: simple horizontal line, not smiling ("serious"/neutral)
  const mouth = (
    <path
      d={`
        M ${-size*0.051} ${size*0.13}
        Q 0 ${size*0.136} ${size*0.051} ${size*0.13}
      `}
      fill="none"
      stroke="#232323"
      strokeWidth="2"
      strokeLinecap="round"
    />
  );

  // Tongue: points OPPOSITE head direction (i.e. 180deg from head angle, toward tile label)
  // Make it a simple forked, slightly wavy tongue
  const tongueLen = size * 0.39;
  // Rotate tongue around (0,0) by 180deg (SVG: head at angle, tongue at angle+180)
  const tongue = (
    <g transform={`rotate(180)`}>
      <path
        d={`
          M 0 ${size*0.23}
          q ${-size*0.01} ${tongueLen*0.30} 0 ${tongueLen*0.45}
          q ${size*0.015} ${tongueLen*0.24} ${size*0.025} ${tongueLen*0.41}
        `}
        fill="none"
        stroke="#e35555"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Forked tip */}
      <path
        d={`M 0 ${size*0.23 + tongueLen * 0.89} q ${-size*0.02} ${size*0.03} 0 ${size*0.06}`}
        fill="none"
        stroke="#e35555"
        strokeWidth="1.1"
      />
      <path
        d={`M 0 ${size*0.23 + tongueLen * 0.89} q ${size*0.02} ${size*0.03} 0 ${size*0.06}`}
        fill="none"
        stroke="#e35555"
        strokeWidth="1.1"
      />
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {headShape}
      {leftEyeGroup}
      {rightEyeGroup}
      {mouth}
      {tongue}
    </g>
  );
};

export default SnakeHead;
