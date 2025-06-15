
import React from "react";

interface SnakeHeadProps {
  x: number;
  y: number;
  angle: number;
  color: string;
  tileSize: number;
}

/**
 * Stylized snake head SVG for Snakes & Ladders, serious but no facial features except eyes.
 */
const SnakeHead = ({ x, y, angle, color, tileSize }: SnakeHeadProps) => {
  const size = tileSize * 0.8;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {/* Head base */}
      <ellipse cx="0" cy="0" rx={size * 0.32} ry={size * 0.23} fill={color} stroke="#232323" strokeWidth="2"/>
      {/* Eyes: round and expressive */}
      <ellipse cx={-size * 0.10} cy={-size * 0.08} rx={size*0.07} ry={size*0.09} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={-size * 0.10} cy={-size * 0.10} rx={size*0.028} ry={size*0.028} fill="#1b1b1b"/>
      <ellipse cx={size * 0.10} cy={-size * 0.08} rx={size*0.07} ry={size*0.09} fill="#fff" stroke="#222" strokeWidth="1"/>
      <ellipse cx={size * 0.10} cy={-size * 0.10} rx={size*0.028} ry={size*0.028} fill="#1b1b1b"/>
      {/* Forked tongue */}
      <path d={`
        M 0 ${size*0.17}
        q 0 ${size*0.08} ${size*0.04} ${size*0.12}
        M 0 ${size*0.17}
        q 0 ${size*0.08} -${size*0.04} ${size*0.12}
      `} fill="none" stroke="#e35555" strokeWidth="2" />
    </g>
  );
};

export default SnakeHead;
