
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
    5: 58, 9: 27, 33: 87, 40: 64, 57: 73, 63: 81, 75: 93,
  }
});

interface GameBoardGridProps {
  player1Position: number;
  player2Position: number;
  onTileClick: (position: number) => void;
}

const GameBoardGrid = ({ player1Position, player2Position, onTileClick }: GameBoardGridProps) => {
  const { snakes, ladders } = getSpecialTiles();

  // 10x10 board
  const createBoard = () => {
    const tiles = [];
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        const position = row % 2 === 1
          ? row * 10 + (10 - col)
          : row * 10 + (col + 1);

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
            row={row}
            col={col}
          />
        );
      }
    }
    return tiles;
  };

  // Board aspect & overlays
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
