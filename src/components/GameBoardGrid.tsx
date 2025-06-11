
import React from 'react';
import BoardTile from './BoardTile';
import SnakeOverlay from './SnakeOverlay';
import LadderOverlay from './LadderOverlay';

interface GameBoardGridProps {
  player1Position: number;
  player2Position: number;
  onTileClick: (position: number) => void;
  relationshipType: string;
}

const GameBoardGrid = ({ player1Position, player2Position, onTileClick, relationshipType }: GameBoardGridProps) => {
  const createBoard = () => {
    const tiles = [];
    for (let row = 9; row >= 0; row--) {
      const rowTiles = [];
      for (let col = 0; col < 10; col++) {
        const position = row % 2 === 1 
          ? row * 10 + (10 - col)
          : row * 10 + (col + 1);
        
        const isPlayer1Here = player1Position === position;
        const isPlayer2Here = player2Position === position;
        
        rowTiles.push(
          <BoardTile
            key={position}
            tileNumber={position}
            isPlayer1Here={isPlayer1Here}
            isPlayer2Here={isPlayer2Here}
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
