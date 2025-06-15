
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
  const highlightStyles =
    "bg-gradient-to-r from-purple-300 via-white to-pink-300 shadow-md ring-2 ring-purple-400";
  const currentStyle = (who: "player1" | "player2") =>
    currentTurn === who
      ? "animate-pulse ring-2 ring-pink-500 scale-105 " + highlightStyles
      : "bg-white";

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className={`p-4 transition-all duration-300 text-center ${currentStyle('player1')}`}>
        <div>
          <div className="text-2xl mb-2">🔴</div>
          <h3 className={`font-semibold text-gray-800 transition-all text-lg ${currentTurn === "player1" ? "drop-shadow-lg" : ""}`}>{player1Name}</h3>
          <p className="text-sm text-gray-600">Position: {player1Position}</p>
          {currentTurn === 'player1' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full animate-pulse">
                {isMultiplayer && currentPlayerId !== 'player1' ? "Their Turn" : "Your Turn"}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card className={`p-4 transition-all duration-300 text-center ${currentStyle('player2')}`}>
        <div>
          <div className="text-2xl mb-2">🔵</div>
          <h3 className={`font-semibold text-gray-800 transition-all text-lg ${currentTurn === "player2" ? "drop-shadow-lg" : ""}`}>{player2Name}</h3>
          <p className="text-sm text-gray-600">Position: {player2Position}</p>
          {currentTurn === 'player2' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full animate-pulse">
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
