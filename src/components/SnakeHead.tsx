
import React from "react";

interface SnakeHeadProps {
  x: number;
  y: number;
  angle: number;
  color: string;
  tileSize: number;
}

/**
 * Stylized, "serious" snake head SVG for Snakes & Ladders, decoupled for overlay reuse.
 */
const SnakeHead = ({ x, y, angle, color, tileSize }: SnakeHeadProps) => {
  const size = tileSize * 0.8;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {/* Head base */}
      <ellipse cx="0" cy="0" rx={size * 0.32} ry={size * 0.23} fill={color} stroke="#232323" strokeWidth="2"/>
      {/* Angry eyebrows (serious) */}
      {/* Left eyebrow */}
      <path d={`
        M ${-size * 0.13} ${-size * 0.13}
        Q ${-size * 0.08} ${-size * 0.19} ${-size * 0.02} ${-size * 0.13}
      `} stroke="#211" strokeWidth="2" fill="none" />
      {/* Right eyebrow */}
      <path d={`
        M ${size * 0.13} ${-size * 0.13}
        Q ${size * 0.08} ${-size * 0.19} ${size * 0.02} ${-size * 0.13}
      `} stroke="#211" strokeWidth="2" fill="none" />
      {/* Eyes */}
      <ellipse cx={-size * 0.10} cy={-size * 0.08} rx={size*0.05} ry={size*0.07} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={-size * 0.10} cy={-size * 0.11} rx={size*0.024} ry={size*0.024} fill="#1b1b1b"/>
      <ellipse cx={size * 0.10} cy={-size * 0.08} rx={size*0.05} ry={size*0.07} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={size * 0.10} cy={-size * 0.11} rx={size*0.024} ry={size*0.024} fill="#1b1b1b"/>
      {/* Nose holes */}
      <ellipse cx={-size * 0.05} cy={size*0.01} rx={size*0.012} ry={size*0.022} fill="#222"/>
      <ellipse cx={size * 0.05} cy={size*0.01} rx={size*0.012} ry={size*0.022} fill="#222"/>
      {/* Mouth: serious (straight or downward) */}
      <path d={`
        M ${-size*0.06} ${size*0.11}
        Q 0 ${size*0.08} ${size*0.06} ${size*0.11}
      `} fill="none" stroke="#232323" strokeWidth="2" />
      {/* Tongue (still sticking out) */}
      <path d={`
        M 0 ${size*0.17}
        q 0 ${size*0.07} ${size*0.04} ${size*0.12}
        M 0 ${size*0.17}
        q 0 ${size*0.07} -${size*0.04} ${size*0.12}
      `} fill="none" stroke="#e35555" strokeWidth="2" />
    </g>
  );
};

export default SnakeHead;
