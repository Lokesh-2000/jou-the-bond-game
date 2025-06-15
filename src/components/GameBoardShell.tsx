
import React from "react";
import GameBoardMainSection from "./GameBoardMainSection";
import GameBoardSidebar from "./GameBoardSidebar";
import GameBoardModals from "./GameBoardModals";
import MultiplayerWaiting from "./MultiplayerWaiting";
import BoardChatArea from "./BoardChatArea";

interface GameBoardShellProps {
  gameState: any;
  gameData: any;
  roomCode?: string;
  isMultiplayer: boolean;
  currentPlayerId: string;
  isRolling: boolean;
  handleTileClick: (pos: number, toast?: (args: any) => void) => void;
  handleRollDice: () => void;
  handleNewGame: () => void;
  showChat: boolean;
  playerInfoProps: any;
  controlsProps: any;
  modalsProps: any;
}

const GameBoardShell = ({
  gameState,
  gameData,
  roomCode,
  isMultiplayer,
  currentPlayerId,
  isRolling,
  handleTileClick,
  handleRollDice,
  handleNewGame,
  showChat,
  playerInfoProps,
  controlsProps,
  modalsProps,
}: GameBoardShellProps) => {
  if (isMultiplayer && !gameState.gameStarted) {
    return (
      <MultiplayerWaiting
        roomCode={roomCode}
        player1Nickname={gameData.player1Nickname}
        player2Nickname={gameData.player2Nickname}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <GameBoardMainSection
            gameState={gameState}
            gameData={gameData}
            roomCode={roomCode}
            showChat={showChat}
            handleTileClick={handleTileClick}
          />
          <GameBoardSidebar
            {...playerInfoProps}
            {...controlsProps}
          />
        </div>
      </div>
      <GameBoardModals {...modalsProps} />
    </div>
  );
};

export default GameBoardShell;
