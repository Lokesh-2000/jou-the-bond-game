
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DiceController from './DiceController';

interface GameControlsProps {
  currentTurn: 'player1' | 'player2';
  gameEnded: boolean;
  winner: string | null;
  lastDiceRoll: number;
  onRollDice: () => void;
  onNewGame: () => void;
  isMultiplayer?: boolean;
  currentPlayerId?: string;
  isWaitingForOtherPlayer?: boolean;
}

const GameControls = ({
  currentTurn,
  gameEnded,
  winner,
  lastDiceRoll,
  onRollDice,
  onNewGame,
  isMultiplayer = false,
  currentPlayerId,
  isWaitingForOtherPlayer = false
}: GameControlsProps) => {
  const isMyTurn = isMultiplayer ? currentTurn === currentPlayerId : true;
  const canRollDice = !gameEnded && isMyTurn && !isWaitingForOtherPlayer;

  if (gameEnded) {
    return (
      <Card className="p-6 text-center bg-gradient-to-r from-purple-100 to-pink-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🎉 Game Over! 🎉
        </h2>
        <p className="text-lg mb-4">
          {isMultiplayer ? 
            (winner === currentPlayerId ? "You won!" : `${winner === 'player1' ? 'Player 1' : 'Player 2'} won!`) :
            `${winner === 'player1' ? 'Player 1' : 'Player 2'} wins!`
          }
        </p>
        {!isMultiplayer && (
          <Button onClick={onNewGame} className="px-6 py-2">
            New Game
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <DiceController 
          onRoll={onRollDice}
          disabled={!canRollDice}
          lastRoll={lastDiceRoll}
        />
        
        {isWaitingForOtherPlayer && (
          <p className="text-sm text-gray-600">
            Waiting for other player...
          </p>
        )}
        
        {isMultiplayer && !isMyTurn && !isWaitingForOtherPlayer && (
          <p className="text-sm text-gray-600">
            Waiting for {currentTurn === 'player1' ? 'Player 1' : 'Player 2'} to roll
          </p>
        )}
        
        {!isMultiplayer && (
          <Button 
            onClick={onNewGame} 
            variant="outline" 
            className="mt-4"
          >
            New Game
          </Button>
        )}
      </div>
    </Card>
  );
};

export default GameControls;
