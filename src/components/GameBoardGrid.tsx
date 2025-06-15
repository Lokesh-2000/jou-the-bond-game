
import React from 'react';
import BoardTile from './BoardTile';
import SnakeOverlay from './SnakeOverlay';
import LadderOverlay from './LadderOverlay';

// Utility to determine if tile has a snake or ladder (for board rendering)
const getSpecialTiles = () => ({
  snakes: {
    38: 15, 47: 19, 53: 35,
    62: 55, 86: 54, 87: 24, 92: 70, 94: 6, 97: 78, 82: 65, 29: 8,
  },
  ladders: {
    5: 58, 9: 27, 33: 87, 40: 64, 57: 73, 63: 81, 76: 84, // changed 75-93 to 76-84
  }
});

interface GameBoardGridProps {
  player1Position: number;
  player2Position: number;
  onTileClick: (position: number) => void;
}

const GameBoardGrid = ({ player1Position, player2Position, onTileClick }: GameBoardGridProps) => {
  const { snakes, ladders } = getSpecialTiles();

  // 10x10 board, 1 at bottom-left to 10 at bottom-right
  // 91-100 is top row (left to right), so 100 is top-left
  const createBoard = () => {
    const tiles = [];
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        // Even row (from bottom): left to right, Odd: right to left
        const isEvenRow = row % 2 === 0;
        const position = isEvenRow
          ? row * 10 + (col + 1)     // left to right
          : row * 10 + (10 - col);  // right to left

        const hasPlayer1 = player1Position === position;
        const hasPlayer2 = player2Position === position;
        const hasSnake = snakes.hasOwnProperty(position);
        const hasLadder = ladders.hasOwnProperty(position);

        tiles.push(
          <BoardTile
            key={position}
            tileNumber={position}
            hasPlayer1={hasPlayer1}
            hasPlayer2={hasPlayer2}
            hasSnake={hasSnake}
            hasLadder={hasLadder}
            themeColors={null}
            row={9-row} // grid row 1 at bottom
            col={col}
          />
        );
      }
    }
    return tiles;
  };

  return (
    <div
      className="relative mx-auto rounded-lg border-[3px] border-black shadow-xl aspect-square bg-white overflow-visible"
      style={{
        width: 'min(95vw, 95vh, 640px)',
        maxWidth: '100vw',
        maxHeight: '100vw'
      }}
    >
      {/* Overlays */}
      <SnakeOverlay />
      <LadderOverlay />
      {/* Tiles */}
      <div
        className="grid grid-rows-10 grid-cols-10 w-full h-full"
        style={{
          minWidth: '640px', // ensures SVG overlays match grid
          minHeight: '640px',
        }}
      >
        {createBoard()}
      </div>
    </div>
  );
};

export default GameBoardGrid;
