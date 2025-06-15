
import React from "react";

interface MultiplayerWaitingProps {
  roomCode?: string;
  player1Nickname?: string;
  player2Nickname?: string;
}

const MultiplayerWaiting: React.FC<MultiplayerWaitingProps> = ({
  roomCode,
  player1Nickname,
  player2Nickname,
}) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
        🎮
      </div>
      <h2 className="text-2xl font-bold text-gray-800">
        {player2Nickname
          ? "Starting Game..."
          : "Waiting for Player 2"}
      </h2>
      <p className="text-gray-600">
        Share room code: <strong>{roomCode}</strong>
      </p>
      {player1Nickname && (
        <p className="text-green-600">✓ {player1Nickname} joined</p>
      )}
      {player2Nickname && (
        <p className="text-green-600">✓ {player2Nickname} joined</p>
      )}
    </div>
  </div>
);

export default MultiplayerWaiting;
