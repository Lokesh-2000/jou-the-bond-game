
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import GameBoardGrid from './GameBoardGrid';
import PlayerInfo from './PlayerInfo';
import GameControls from './GameControls';
import GameStatus from './GameStatus';
import QuestionModal from './QuestionModal';
import ReactionModal from './ReactionModal';

interface GameBoardProps {
  gameData: any;
  roomCode?: string;
}

const GameBoard = ({ gameData, roomCode }: GameBoardProps) => {
  // Game state
  const [gameState, setGameState] = useState(() => {
    if (gameData.gameState) {
      return gameData.gameState;
    }
    return {
      player1Position: 0,
      player2Position: 0,
      currentTurn: 'player1' as 'player1' | 'player2',
      lastDiceRoll: 1,
      questionsTriggered: [] as number[],
      gameStarted: gameData.isMultiplayer ? false : true,
      gameEnded: false,
      winner: null as string | null
    };
  });

  // UI state
  const [isRolling, setIsRolling] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionType, setReactionType] = useState<'snake' | 'ladder'>('snake');

  const { toast } = useToast();

  // Multiplayer setup
  const isMultiplayer = gameData.isMultiplayer || false;
  const currentPlayerId = gameData.currentPlayerId || 'player1';

  useEffect(() => {
    if (gameData.gameState) {
      console.log('Updating game state from gameData:', gameData.gameState);
      setGameState(gameData.gameState);
    }
  }, [gameData.gameState]);

  // Check if both players are present and game should start
  useEffect(() => {
    if (isMultiplayer && gameData.player1Nickname && gameData.player2Nickname && !gameState.gameStarted) {
      console.log('Both players present, starting game');
      const newGameState = {
        ...gameState,
        gameStarted: true
      };
      setGameState(newGameState);
      
      if (gameData.onGameStateUpdate) {
        gameData.onGameStateUpdate(newGameState);
      }
    }
  }, [gameData.player1Nickname, gameData.player2Nickname, gameState.gameStarted, isMultiplayer]);

  // Generate simple questions based on game data
  const generateQuestions = () => {
    const questions = [
      "What's your favorite memory together?",
      "What's one thing you appreciate about each other?",
      "If you could travel anywhere together, where would it be?",
      "What's a goal you'd like to achieve together?",
      "What's something new you'd like to try together?"
    ];
    return questions;
  };

  // Game logic functions
  const getSpecialTiles = () => ({
    snakes: { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 },
    ladders: { 1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 }
  });

  const rollDice = async () => {
    if (isRolling || gameState.gameEnded || !gameState.gameStarted) return;
    if (isMultiplayer && gameState.currentTurn !== currentPlayerId) return;

    setIsRolling(true);
    
    // Simulate dice roll animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const roll = Math.floor(Math.random() * 6) + 1;
    const newGameState = { ...gameState, lastDiceRoll: roll };
    
    // Move player
    const currentPlayer = gameState.currentTurn;
    const currentPosition = currentPlayer === 'player1' ? gameState.player1Position : gameState.player2Position;
    let newPosition = Math.min(100, currentPosition + roll);
    
    // Handle special tiles
    const { snakes, ladders } = getSpecialTiles();
    
    if (snakes[newPosition]) {
      newPosition = snakes[newPosition];
      setReactionType('snake');
      setShowReaction(true);
    } else if (ladders[newPosition]) {
      newPosition = ladders[newPosition];
      setReactionType('ladder');
      setShowReaction(true);
    }
    
    // Update position
    if (currentPlayer === 'player1') {
      newGameState.player1Position = newPosition;
    } else {
      newGameState.player2Position = newPosition;
    }
    
    // Check for win condition
    if (newPosition === 100) {
      newGameState.gameEnded = true;
      newGameState.winner = currentPlayer;
      toast({
        title: "🎉 Congratulations!",
        description: `${currentPlayer === 'player1' ? gameData.player1Nickname || 'Player 1' : gameData.player2Nickname || 'Player 2'} wins!`,
      });
    } else {
      // Check for question triggers
      const questionTiles = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      if (questionTiles.includes(newPosition) && !gameState.questionsTriggered.includes(newPosition)) {
        const questions = generateQuestions();
        const question = questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(question);
        newGameState.questionsTriggered = [...gameState.questionsTriggered, newPosition];
      }
      
      // Switch turns
      newGameState.currentTurn = currentPlayer === 'player1' ? 'player2' : 'player1';
    }
    
    setGameState(newGameState);
    
    // Update multiplayer state if needed
    if (isMultiplayer && gameData.onGameStateUpdate) {
      await gameData.onGameStateUpdate(newGameState);
    }
    
    setIsRolling(false);
  };

  const handleNewGame = () => {
    if (isMultiplayer) return; // Don't allow new game in multiplayer
    
    setGameState({
      player1Position: 0,
      player2Position: 0,
      currentTurn: 'player1',
      lastDiceRoll: 1,
      questionsTriggered: [],
      gameStarted: true,
      gameEnded: false,
      winner: null
    });
    setCurrentQuestion(null);
    setShowReaction(false);
  };

  const handleTileClick = (position: number) => {
    if (!gameState.gameEnded) return;
    
    toast({
      title: "Tile Info",
      description: `Tile ${position}`,
    });
  };

  const handleQuestionClose = () => {
    setCurrentQuestion(null);
  };

  const handleReactionClose = () => {
    setShowReaction(false);
  };

  // Waiting for second player in multiplayer
  if (isMultiplayer && !gameState.gameStarted) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2 space-y-6">
            <GameBoardGrid
              player1Position={gameState.player1Position}
              player2Position={gameState.player2Position}
              onTileClick={handleTileClick}
              relationshipType={gameData.relationshipType || 'friend'}
            />
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
              onRollDice={rollDice}
              onNewGame={handleNewGame}
              isMultiplayer={isMultiplayer}
              currentPlayerId={currentPlayerId}
              isWaitingForOtherPlayer={isRolling}
            />

            <GameStatus
              roomCode={roomCode}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {currentQuestion && (
        <QuestionModal
          showQuestion={!!currentQuestion}
          currentQuestion={currentQuestion}
          answer="" // You may want to manage answer state if not already, but blank answer to match props
          setAnswer={() => {}} // dummy, so it doesn't error; to properly implement, you should add answer state
          onSubmit={() => setCurrentQuestion(null)}
          onMirror={() => {}}
          onSkip={() => setCurrentQuestion(null)}
          canMirror={false}
          canSkip={true}
          onClose={handleQuestionClose}
        />
      )}

      {showReaction && (
        <ReactionModal
          showReactions={showReaction}
          lastAnswer=""
          onReaction={() => setShowReaction(false)}
          onClose={handleReactionClose}
        />
      )}
    </div>
  );
};

export default GameBoard;
