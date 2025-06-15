
import React from "react";
import Pawn from "./Pawn";

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
  // Checkerboard pattern - consistent colors
  const getTileColor = () => {
    const even = (row + col) % 2 === 0;
    return even ? "bg-[#F0F8FF]" : "bg-[#FFE4E1]";
  };

  // Text color
  const getTextColor = () => {
    if (tileNumber === START_TILE) return "text-green-600";
    if (tileNumber === FINISH_TILE) return "text-rose-600";
    return "text-gray-800";
  };

  // Chess pawn size: 65% of tile
  const pawnSize = 0.65 * 80;

  return (
    <div
      className={`
        relative flex items-center justify-center
        ${getTileColor()}
        border-[1px] border-gray-400
        transition-all duration-200
      `}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        borderRadius: "0.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflow: "visible",
        width: "100%",
        height: "100%",
        minWidth: "64px",
        minHeight: "64px"
      }}
    >
      {/* Centered Number */}
      <span
        className={`
          flex items-center justify-center
          text-sm sm:text-base font-bold select-none
          ${getTextColor()}
          absolute inset-0 pointer-events-none
        `}
        style={{
          textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          zIndex: 2,
        }}
      >
        {tileNumber}
      </span>
      
      {/* START/FINISH labels */}
      {tileNumber === START_TILE && (
        <span className="absolute bottom-1 left-1 text-xs font-bold px-1 py-0.5 rounded bg-green-100 text-green-700 border border-green-300 shadow z-10 select-none">
          START
        </span>
      )}
      {tileNumber === FINISH_TILE && (
        <span className="absolute bottom-1 right-1 text-xs font-bold px-1 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300 shadow z-10 select-none">
          FINISH
        </span>
      )}
      
      {/* Player 1 Chess Pawn */}
      {hasPlayer1 && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-60%, -50%)`,
            zIndex: 30,
            width: pawnSize,
            height: pawnSize,
            pointerEvents: "none",
          }}
        >
          <Pawn color="#a259f7" size={pawnSize} />
        </span>
      )}
      
      {/* Player 2 Chess Pawn */}
      {hasPlayer2 && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-40%, -50%)`,
            zIndex: 30,
            width: pawnSize,
            height: pawnSize,
            pointerEvents: "none",
          }}
        >
          <Pawn color="#ff62a3" size={pawnSize} />
        </span>
      )}
    </div>
  );
};

export default BoardTile;
