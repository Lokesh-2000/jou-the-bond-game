import { useToast } from "@/hooks/use-toast";
import GameBoardGrid from './GameBoardGrid';
import PlayerInfo from './PlayerInfo';
import GameControls from './GameControls';
import QuestionModal from './QuestionModal';
import ReactionModal from './ReactionModal';
import { useGameEngine } from './hooks/useGameEngine';
import { useQuestions } from './hooks/useQuestions';
import { useState, useEffect, useRef } from "react";
import Chat from './Chat';

interface GameBoardProps {
  gameData: any;
  roomCode?: string;
}

const GameBoard = ({ gameData, roomCode }: GameBoardProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionType, setReactionType] = useState<'snake' | 'ladder'>('snake');
  const [questionAnswerSync, setQuestionAnswerSync] = useState<{question: string|null, answer: string|null}>({question: null, answer: null});

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

  // Multiplayer waiting state
  if (
    isMultiplayer &&
    !gameState.gameStarted
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
            🎮
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {gameData.player2Nickname ? 'Starting Game...' : 'Waiting for Player 2'}
          </h2>
          <p className="text-gray-600">Share room code: <strong>{roomCode}</strong></p>
          {gameData.player1Nickname && (
            <p className="text-green-600">✓ {gameData.player1Nickname} joined</p>
          )}
          {gameData.player2Nickname && (
            <p className="text-green-600">✓ {gameData.player2Nickname} joined</p>
          )}
        </div>
      </div>
    );
  }

  // Only allow dice roll if: no win & not rolling & this player's turn
  const isTurn =
    !gameState.gameEnded &&
    !isRolling &&
    ((isMultiplayer && currentPlayerId === gameState.currentTurn) || !isMultiplayer);

  // Show chat only if multiplayer and has a session id
  const showChat = !!gameData.sessionId || !!roomCode;

  // Listen for gameState changes for multiplayer question/answer visibility
  useEffect(() => {
    if (!isMultiplayer || !gameState) return;
    // If session game state includes a last question/answer, show them
    if (gameState.lastQuestionAsked || gameState.lastQuestionAnswer) {
      setQuestionAnswerSync({
        question: gameState.lastQuestionAsked || null,
        answer: gameState.lastQuestionAnswer || null
      });
    }
  }, [gameState, isMultiplayer]);

  // Enhanced: snake triggers question popup always (and sync answer)
  const handleRollDice = async () => {
    await rollDiceAndMove({
      onQuestionTriggered: (_, pos) => {
        const pickedQuestion = getRandomQuestion();
        setCurrentQuestion(pickedQuestion);
        setQuestionAnswerSync({ question: pickedQuestion, answer: null });
        setGameState(gs => ({
          ...gs,
          questionsTriggered: [...gs.questionsTriggered, pos],
          lastQuestionAsked: pickedQuestion,
          lastQuestionAnswer: null,
        }));
        // Multiplayer: share in session
        if (isMultiplayer && gameData.onGameStateUpdate) {
          gameData.onGameStateUpdate({
            ...gameState,
            questionsTriggered: [...gameState.questionsTriggered, pos],
            lastQuestionAsked: pickedQuestion,
            lastQuestionAnswer: null,
          });
        }
      },
      onReaction: (type) => {
        setReactionType(type);
        setShowReaction(true);
      },
      toast,
      onSnake: () => {
        const pickedQuestion = getRandomQuestion();
        setCurrentQuestion(pickedQuestion);
        setQuestionAnswerSync({ question: pickedQuestion, answer: null });
        setGameState(gs => ({
          ...gs,
          lastQuestionAsked: pickedQuestion,
          lastQuestionAnswer: null,
        }));
        if (isMultiplayer && gameData.onGameStateUpdate) {
          gameData.onGameStateUpdate({
            ...gameState,
            lastQuestionAsked: pickedQuestion,
            lastQuestionAnswer: null
          });
        }
      }
    });
  };

  // When answering, sync to session for Player B to see
  const handleCloseQuestion = (answer?: string) => {
    setCurrentQuestion(null);
    setQuestionAnswerSync(prev => ({
      ...prev,
      answer: answer || ""
    }));
    setGameState(gs => ({
      ...gs,
      lastQuestionAnswer: answer || ""
    }));
    // Multiplayer: update session
    if (isMultiplayer && gameData.onGameStateUpdate) {
      gameData.onGameStateUpdate({
        ...gameState,
        lastQuestionAnswer: answer || ""
      });
    }
  };

  const handleCloseReaction = () => setShowReaction(false);

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
              <Chat
                sessionId={gameData.sessionId || roomCode}
                nickname={gameData.nickname || gameData.player1Nickname || gameData.player2Nickname || "Player"}
                sender={gameData.currentPlayerId || "player1"}
              />
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
            {/* Room code removed! No GameStatus */}

          </div>
        </div>
      </div>

      {/* Modals */}
      {(currentQuestion || questionAnswerSync.question) && (
        <QuestionModal
          showQuestion={!!currentQuestion || !!questionAnswerSync.question}
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
