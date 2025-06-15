import { useToast } from "@/hooks/use-toast";
import GameBoardShell from "./GameBoardShell";
import { useGameEngine } from "./hooks/useGameEngine";
import { useQuestions } from "./hooks/useQuestions";
import { useState, useEffect } from "react";
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
    currentPlayerId,
  } = useGameEngine(gameData);

  const { getRandomQuestion } = useQuestions();

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
    handleCloseReaction,
  } = useReactionModal();

  // Listen for gameState changes for multiplayer question/answer visibility
  useEffect(() => {
    if (!isMultiplayer || !gameState) return;
    syncFromGameState(gameState);
  }, [gameState, isMultiplayer, syncFromGameState]);

  // Only allow dice roll if: no win & not rolling & this player's turn
  const isTurn =
    !gameState.gameEnded &&
    !isRolling &&
    ((isMultiplayer && currentPlayerId === gameState.currentTurn) ||
      !isMultiplayer);

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
      },
    });
  };

  // Only allow chat if multiplayer and has a session id / room code
  const showChat = !!gameData.sessionId || !!roomCode;

  // Modals logic for child component
  const [modalAnswer, setModalAnswer] = useState("");
  useEffect(() => {
    // Keep local modalAnswer in sync with questionAnswerSync
    setModalAnswer(questionAnswerSync.answer || "");
  }, [questionAnswerSync.answer]);

  // Handlers for the modals
  const handleCloseQuestionModal = (answer?: string) => {
    handleAnswer(answer);
    setModalAnswer("");
  };

  return (
    <GameBoardShell
      gameState={gameState}
      gameData={gameData}
      roomCode={roomCode}
      isMultiplayer={isMultiplayer}
      currentPlayerId={currentPlayerId}
      isRolling={isRolling}
      handleTileClick={handleTileClick}
      handleRollDice={handleRollDice}
      handleNewGame={handleNewGame}
      showChat={showChat}
      playerInfoProps={{
        player1Name:
          gameData.player1Nickname || gameData.nickname || "Player 1",
        player2Name: gameData.player2Nickname || "Player 2",
        currentTurn: gameState.currentTurn,
        player1Position: gameState.player1Position,
        player2Position: gameState.player2Position,
        isMultiplayer,
        currentPlayerId,
      }}
      controlsProps={{
        currentTurn: gameState.currentTurn,
        gameEnded: gameState.gameEnded,
        winner: gameState.winner,
        lastDiceRoll: gameState.lastDiceRoll,
        onRollDice: handleRollDice,
        onNewGame: handleNewGame,
        isMultiplayer,
        currentPlayerId,
        isWaitingForOtherPlayer: isRolling,
        isTurn,
      }}
      modalsProps={{
        showQuestion,
        currentQuestion:
          currentQuestion || questionAnswerSync.question || "",
        answer: modalAnswer,
        setAnswer: setModalAnswer,
        onSubmit: () => handleCloseQuestionModal(modalAnswer),
        onMirror: () => {},
        onSkip: () => handleCloseQuestionModal(),
        canMirror: false,
        canSkip: true,
        onCloseQuestion: () => setCurrentQuestion(null),
        showReaction,
        reactionType,
        lastAnswer: questionAnswerSync.answer || "",
        onReaction: handleCloseReaction,
        onCloseReaction: handleCloseReaction,
      }}
    />
  );
};

export default GameBoard;
