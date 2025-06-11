
import React from 'react';
import { Card } from "@/components/ui/card";

interface PlayerInfoProps {
  player1Name: string;
  player2Name: string;
  currentTurn: 'player1' | 'player2';
  player1Position: number;
  player2Position: number;
  isMultiplayer?: boolean;
  currentPlayerId?: string;
}

const PlayerInfo = ({ 
  player1Name, 
  player2Name, 
  currentTurn, 
  player1Position, 
  player2Position,
  isMultiplayer = false,
  currentPlayerId
}: PlayerInfoProps) => {
  const isMyTurn = isMultiplayer ? currentTurn === currentPlayerId : true;
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className={`p-4 transition-all duration-300 ${
        currentTurn === 'player1' ? 'ring-2 ring-purple-400 bg-purple-50' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="text-2xl mb-2">🔴</div>
          <h3 className="font-semibold text-gray-800">{player1Name}</h3>
          <p className="text-sm text-gray-600">Position: {player1Position}</p>
          {currentTurn === 'player1' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {isMultiplayer && currentPlayerId !== 'player1' ? "Their Turn" : "Your Turn"}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card className={`p-4 transition-all duration-300 ${
        currentTurn === 'player2' ? 'ring-2 ring-pink-400 bg-pink-50' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="text-2xl mb-2">🔵</div>
          <h3 className="font-semibold text-gray-800">{player2Name}</h3>
          <p className="text-sm text-gray-600">Position: {player2Position}</p>
          {currentTurn === 'player2' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                {isMultiplayer && currentPlayerId !== 'player2' ? "Their Turn" : "Your Turn"}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PlayerInfo;
