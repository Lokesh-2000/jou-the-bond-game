
import { useState, useEffect } from 'react';

export interface GameState {
  player1Position: number;
  player2Position: number;
  currentTurn: 'player1' | 'player2';
  lastDiceRoll: number;
  questionsTriggered: number[];
  gameStarted: boolean;
  gameEnded: boolean;
  winner: string | null;
}

export const useGameEngine = (gameData: any) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (gameData.gameState) {
      return gameData.gameState;
    }
    return {
      player1Position: 0,
      player2Position: 0,
      currentTurn: 'player1',
      lastDiceRoll: 1,
      questionsTriggered: [],
      gameStarted: gameData.isMultiplayer ? false : true,
      gameEnded: false,
      winner: null,
    };
  });
  const [isRolling, setIsRolling] = useState(false);

  // Multiplayer setup
  const isMultiplayer = gameData.isMultiplayer || false;
  const currentPlayerId = gameData.currentPlayerId || 'player1';

  useEffect(() => {
    if (gameData.gameState) {
      setGameState(gameData.gameState);
    }
  }, [gameData.gameState]);

  // Check if both players are present and game should start
  useEffect(() => {
    if (
      isMultiplayer &&
      gameData.player1Nickname &&
      gameData.player2Nickname &&
      !gameState.gameStarted
    ) {
      const newGameState = {
        ...gameState,
        gameStarted: true,
      };
      setGameState(newGameState);

      if (gameData.onGameStateUpdate) {
        gameData.onGameStateUpdate(newGameState);
      }
    }
    // eslint-disable-next-line
  }, [gameData.player1Nickname, gameData.player2Nickname, gameState.gameStarted, isMultiplayer]);

  // Special tile logic helpers
  const getSpecialTiles = () => ({
    snakes: {
      16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60,
      87: 24, 93: 73, 95: 75, 98: 78,
    },
    ladders: {
      1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67,
      71: 91, 80: 100,
    },
  });

  const rollDiceAndMove = async ({
    onQuestionTriggered,
    onReaction,
    toast,
  }: {
    onQuestionTriggered?: (question: string, position: number) => void;
    onReaction?: (type: 'snake' | 'ladder') => void;
    toast?: (args: any) => void;
  }) => {
    if (isRolling || gameState.gameEnded || !gameState.gameStarted) return;
    if (isMultiplayer && gameState.currentTurn !== currentPlayerId) return;

    setIsRolling(true);

    // Simulate dice roll animation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const roll = Math.floor(Math.random() * 6) + 1;
    const newGameState: GameState = { ...gameState, lastDiceRoll: roll };

    // Move player
    const currentPlayer = gameState.currentTurn;
    const currentPosition =
      currentPlayer === 'player1'
        ? gameState.player1Position
        : gameState.player2Position;
    let newPosition = Math.min(100, currentPosition + roll);

    // Handle special tiles
    const { snakes, ladders } = getSpecialTiles();

    if (snakes[newPosition]) {
      newPosition = snakes[newPosition];
      onReaction && onReaction('snake');
    } else if (ladders[newPosition]) {
      newPosition = ladders[newPosition];
      onReaction && onReaction('ladder');
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
      toast &&
        toast({
          title: '🎉 Congratulations!',
          description:
            currentPlayer === 'player1'
              ? gameData.player1Nickname || 'Player 1' + ' wins!'
              : gameData.player2Nickname || 'Player 2' + ' wins!',
        });
    } else {
      // Check for question triggers
      const questionTiles = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      if (
        questionTiles.includes(newPosition) &&
        !gameState.questionsTriggered.includes(newPosition)
      ) {
        onQuestionTriggered && onQuestionTriggered('', newPosition);
        newGameState.questionsTriggered = [
          ...gameState.questionsTriggered,
          newPosition,
        ];
      }
      // Switch turns
      newGameState.currentTurn =
        currentPlayer === 'player1' ? 'player2' : 'player1';
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
      winner: null,
    });
  };

  const handleTileClick = (position: number, toast?: (args: any) => void) => {
    if (!gameState.gameEnded) return;
    toast &&
      toast({
        title: 'Tile Info',
        description: `Tile ${position}`,
      });
  };

  return {
    gameState,
    setGameState,
    isRolling,
    rollDiceAndMove,
    handleNewGame,
    handleTileClick,
    getSpecialTiles,
    isMultiplayer,
    currentPlayerId,
  };
};
