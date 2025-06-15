
import React from "react";

interface BoardTileProps {
  tileNumber: number;
  hasPlayer1: boolean;
  hasPlayer2: boolean;
  hasSnake: boolean;
  hasLadder: boolean;
  themeColors: any;
  row: number;
  col: number;
}

const START_TILE = 1;
const FINISH_TILE = 100;

const BoardTile = ({
  tileNumber,
  hasPlayer1,
  hasPlayer2,
  hasSnake,
  hasLadder,
  themeColors,
  row,
  col,
}: BoardTileProps) => {
  // Checkerboard pattern
  const getTileColor = () => {
    // Soft alternating: even row, even col => gray, odd row/col => pink
    const even = (row + col) % 2 === 0;
    return even ? "bg-[#EDEDED]" : "bg-[#FFD5E5]";
  };

  // Text color
  const getTextColor = () => {
    if (tileNumber === START_TILE) return "text-green-600";
    if (tileNumber === FINISH_TILE) return "text-rose-600";
    return "text-gray-800";
  };

  return (
    <div
      className={`
        relative flex items-center justify-center
        ${getTileColor()}
        border-[2px] border-black
        w-16 h-16 sm:w-20 sm:h-20
        transition-all duration-300
      `}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        borderRadius: "0.33rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {/* Number */}
      <span
        className={`
          absolute left-1 top-1 text-base sm:text-lg font-bold select-none drop-shadow
          ${getTextColor()}
        `}
        style={{
          textShadow:
            "0 1px 1px rgba(255,255,255,0.7), 1px 1px 2px rgba(0,0,0,0.08)",
          zIndex: 2,
        }}
      >
        {tileNumber}
      </span>
      {/* START/FINISH labels */}
      {tileNumber === START_TILE && (
        <span className="absolute bottom-2 left-2 text-xs sm:text-sm font-black px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-300 shadow z-10 select-none">
          START
        </span>
      )}
      {tileNumber === FINISH_TILE && (
        <span className="absolute bottom-2 right-2 text-xs sm:text-sm font-black px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300 shadow z-10 select-none">
          FINISH
        </span>
      )}
      {/* Players */}
      {hasPlayer1 && (
        <div
          className={`
          absolute -top-2 -left-2 w-6 h-6 rounded-full 
          bg-gradient-to-br from-pink-400 to-rose-500
          flex items-center justify-center text-white text-sm font-bold
          ring-2 ring-white shadow-lg animate-pulse
          border border-white/20 z-30
        `}
        >
          1
        </div>
      )}
      {hasPlayer2 && (
        <div
          className={`
          absolute -top-2 -right-2 w-6 h-6 rounded-full 
          bg-gradient-to-br from-purple-400 to-indigo-500
          flex items-center justify-center text-white text-sm font-bold
          ring-2 ring-white shadow-lg animate-pulse
          border border-white/20 z-30
        `}
        >
          2
        </div>
      )}
    </div>
  );
};

export default BoardTile;
