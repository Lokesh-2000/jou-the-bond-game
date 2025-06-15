
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
  // Checkerboard pattern
  const getTileColor = () => {
    const even = (row + col) % 2 === 0;
    return even ? "bg-[#bfbfbf]" : "bg-[#FFD5E5]";
  };

  // Text color
  const getTextColor = () => {
    if (tileNumber === START_TILE) return "text-green-600";
    if (tileNumber === FINISH_TILE) return "text-rose-600";
    return "text-gray-800";
  };

  // Chess pawn size: 65% of tile (tile ~80px, pawn ~52px)
  const pawnSize = 0.65 * 80; // ignore sm:w override for now (grid always min 80px)
  const pawnOffset = -(pawnSize / 2);

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
        overflow: "visible"
      }}
    >
      {/* Centered Number */}
      <span
        className={`
          flex items-center justify-center
          text-base sm:text-lg font-bold select-none drop-shadow
          ${getTextColor()}
          absolute inset-0 pointer-events-none
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
      {/* Player 1 Chess Pawn */}
      {hasPlayer1 && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "49%",
            transform: `translate(-60%, -53%)`,
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
            top: "49%",
            transform: `translate(-40%, -53%)`,
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
