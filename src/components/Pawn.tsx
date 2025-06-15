
import React from "react";

interface PawnProps {
  color?: string;
  size?: number;
  className?: string;
}

const Pawn = ({ color = "#a259f7", size = 40, className = "" }: PawnProps) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 80 110"
    fill="none"
    style={{ display: "block" }}
  >
    {/* Base */}
    <ellipse cx="40" cy="95" rx="22" ry="12" fill="#504645" opacity="0.25" />
    <ellipse cx="40" cy="84" rx="22" ry="10" fill={color} stroke="#232323" strokeWidth="2"/>
    {/* Body */}
    <ellipse cx="40" cy="58" rx="19" ry="30" fill={color} stroke="#232323" strokeWidth="2"/>
    {/* Neck ring */}
    <ellipse cx="40" cy="38" rx="14" ry="6" fill="#f6e2ff" stroke="#232323" strokeWidth="2"/>
    {/* Head */}
    <circle cx="40" cy="20" r="14" fill={color} stroke="#232323" strokeWidth="2"/>
    {/* Shine */}
    <ellipse cx="36" cy="15" rx="4" ry="7" fill="#fff" opacity="0.27"/>
  </svg>
);

export default Pawn;
