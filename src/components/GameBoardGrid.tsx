
import React from 'react';
import BoardTile from './BoardTile';
import SnakeOverlay from './SnakeOverlay';
import LadderOverlay from './LadderOverlay';

// Utility to determine if tile has a snake or ladder
const getSpecialTiles = () => ({
  snakes: { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 },
  ladders: { 1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 }
});

interface GameBoardGridProps {
  player1Position: number;
  player2Position: number;
  onTileClick: (position: number) => void;
  relationshipType: string;
}

const GameBoardGrid = ({ player1Position, player2Position, onTileClick, relationshipType }: GameBoardGridProps) => {
  const { snakes, ladders } = getSpecialTiles();

  const createBoard = () => {
    const tiles = [];
    for (let row = 9; row >= 0; row--) {
      const rowTiles = [];
      for (let col = 0; col < 10; col++) {
        const position = row % 2 === 1 
          ? row * 10 + (10 - col)
          : row * 10 + (col + 1);

        const hasPlayer1 = player1Position === position;
        const hasPlayer2 = player2Position === position;
        const hasSnake = snakes.hasOwnProperty(position);
        const hasLadder = ladders.hasOwnProperty(position);

        rowTiles.push(
          <BoardTile
            key={position}
            tileNumber={position}
            hasPlayer1={hasPlayer1}
            hasPlayer2={hasPlayer2}
            hasSnake={hasSnake}
            hasLadder={hasLadder}
            themeColors={null} // Currently not used, can add themed coloring if needed
            row={row}
            col={col}
            onClick={() => onTileClick(position)}
          />
        );
      }
      tiles.push(
        <div key={row} className="flex">
          {rowTiles}
        </div>
      );
    }
    return tiles;
  };

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-lg">
      <div className="relative">
        {createBoard()}
        <SnakeOverlay relationshipType={relationshipType} />
        <LadderOverlay relationshipType={relationshipType} />
      </div>
    </div>
  );
};

export default GameBoardGrid;

