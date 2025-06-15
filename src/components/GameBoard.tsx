
import { useToast } from "@/hooks/use-toast";
import GameBoardGrid from './GameBoardGrid';
import PlayerInfo from './PlayerInfo';
import GameControls from './GameControls';
import QuestionModal from './QuestionModal';
import ReactionModal from './ReactionModal';
import { useGameEngine } from './hooks/useGameEngine';
import { useQuestions } from './hooks/useQuestions';
import { useState, useEffect } from "react";
// New imports
import MultiplayerWaiting from './MultiplayerWaiting';
import BoardChatArea from './BoardChatArea';
import { useQuestionModal } from "./hooks/useQuestionModal";
import { useReactionModal } from "./hooks/useReactionModal";

interface GameBoardProps {
  gameData: any;
  roomCode?: string;
}

const GameBoard = ({ gameData, roomCode }: GameBoardProps) => {
  const { toast } = useToast();
  const {
    gameState,
    setGameState,
    isRolling,
    rollDiceAndMove,
    handleNewGame,
    handleTileClick,
    getSpecialTiles,
    isMultiplayer,
    currentPlayerId
  } = useGameEngine(gameData);

  const { getRandomQuestion } = useQuestions();

  // --- Hooks for modal logic
  const {
    showQuestion,
    currentQuestion,
    setCurrentQuestion,
    questionAnswerSync,
    setQuestionAnswerSync,
    handleShowQuestion,
    handleAnswer,
    syncFromGameState,
  } = useQuestionModal(setGameState, isMultiplayer, gameData, gameState);

  const {
    showReaction,
    reactionType,
    handleShowReaction,
    handleCloseReaction
  } = useReactionModal();

  // Multiplayer waiting state
  if (
    isMultiplayer &&
    !gameState.gameStarted
  ) {
    return (
      <MultiplayerWaiting
        roomCode={roomCode}
        player1Nickname={gameData.player1Nickname}
        player2Nickname={gameData.player2Nickname}
      />
    );
  }

  // Show chat only if multiplayer and has a session id
  const showChat = !!gameData.sessionId || !!roomCode;

  // Listen for gameState changes for multiplayer question/answer visibility
  useEffect(() => {
    if (!isMultiplayer || !gameState) return;
    syncFromGameState(gameState);
  }, [gameState, isMultiplayer, syncFromGameState]);

  // Only allow dice roll if: no win & not rolling & this player's turn
  const isTurn =
    !gameState.gameEnded &&
    !isRolling &&
    ((isMultiplayer && currentPlayerId === gameState.currentTurn) || !isMultiplayer);

  // Enhanced: all triggers go through hooks now
  const handleRollDice = async () => {
    await rollDiceAndMove({
      onQuestionTriggered: (_, pos) => {
        const pickedQuestion = getRandomQuestion();
        handleShowQuestion(pickedQuestion, pos);
      },
      onReaction: (type) => {
        handleShowReaction(type);
      },
      toast,
      onSnake: () => {
        const pickedQuestion = getRandomQuestion();
        handleShowQuestion(pickedQuestion, -1);
      }
    });
  };

  // When answering, sync to session for Player B to see
  const handleCloseQuestion = (answer?: string) => {
    handleAnswer(answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Board and Chat */}
          <div className="lg:col-span-2 space-y-6">
            <GameBoardGrid
              player1Position={gameState.player1Position}
              player2Position={gameState.player2Position}
              onTileClick={(pos) => handleTileClick(pos, toast)}
              sliding={gameState.sliding}
            />
            {showChat && (
              <BoardChatArea gameData={gameData} roomCode={roomCode} />
            )}
          </div>
          {/* Game Info Panel */}
          <div className="space-y-6">
            <PlayerInfo
              player1Name={gameData.player1Nickname || gameData.nickname || 'Player 1'}
              player2Name={gameData.player2Nickname || 'Player 2'}
              currentTurn={gameState.currentTurn}
              player1Position={gameState.player1Position}
              player2Position={gameState.player2Position}
              isMultiplayer={isMultiplayer}
              currentPlayerId={currentPlayerId}
            />
            <GameControls
              currentTurn={gameState.currentTurn}
              gameEnded={gameState.gameEnded}
              winner={gameState.winner}
              lastDiceRoll={gameState.lastDiceRoll}
              onRollDice={handleRollDice}
              onNewGame={handleNewGame}
              isMultiplayer={isMultiplayer}
              currentPlayerId={currentPlayerId}
              isWaitingForOtherPlayer={isRolling}
              isTurn={isTurn}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQuestion && (
        <QuestionModal
          showQuestion={showQuestion}
          currentQuestion={currentQuestion || questionAnswerSync.question || ""}
          answer={questionAnswerSync.answer || ""}
          setAnswer={() => {}}
          onSubmit={(answer?: string) => handleCloseQuestion(answer)}
          onMirror={() => {}}
          onSkip={() => handleCloseQuestion()}
          canMirror={false}
          canSkip={true}
          onClose={() => setCurrentQuestion(null)}
        />
      )}

      {showReaction && (
        <ReactionModal
          showReactions={showReaction}
          lastAnswer={questionAnswerSync.answer || ""}
          onReaction={handleCloseReaction}
          onClose={handleCloseReaction}
        />
      )}
    </div>
  );
};

export default GameBoard;
