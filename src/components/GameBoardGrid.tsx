
import React from 'react';
import BoardTile from './BoardTile';

// Utility to determine if tile has a snake or ladder (positions will be updated later)
const getSpecialTiles = () => ({
  snakes: {}, // Fixed positions, empty for now
  ladders: {}
});

interface GameBoardGridProps {
  player1Position: number;
  player2Position: number;
  onTileClick: (position: number) => void;
}

const GameBoardGrid = ({ player1Position, player2Position, onTileClick }: GameBoardGridProps) => {
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
            themeColors={null}
            row={row}
            col={col}
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
        {/* SnakeOverlay and LadderOverlay removed */}
      </div>
    </div>
  );
};

export default GameBoardGrid;

