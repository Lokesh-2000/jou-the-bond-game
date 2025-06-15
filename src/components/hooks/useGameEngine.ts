import { useState, useEffect } from 'react';
import { useSpecialTiles } from "./useSpecialTiles";

export interface GameState {
  player1Position: number;
  player2Position: number;
  currentTurn: 'player1' | 'player2';
  lastDiceRoll: number;
  questionsTriggered: number[];
  gameStarted: boolean;
  gameEnded: boolean;
  winner: string | null;
  sliding?: {
    path: { x: number; y: number; }[];
    player: 'player1' | 'player2';
  }
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
  // FIX: Make sure isRolling only goes true briefly after dice pressed!
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

  // Use shared hook for snakes/ladders config!
  const { snakes, ladders } = useSpecialTiles();

  /**
   * Animates player token sliding from snake head → tail.
   * Returns a sequence of {x, y} points (20 steps) along the snake body for animation.
   * If not a snake tile or not sliding, returns null.
   */
  const getSnakeBodyPath = (fromPos: number, toPos: number) => {
    // Corresponds to positions used in SnakeOverlay
    // Import SNAKE_PATHS from SnakeOverlay
    try {
      // Dynamically import SNAKE_PATHS to avoid cyclic imports
      // @ts-ignore
      const overlay = require('../SnakeOverlay');
      const SNAKE_PATHS = overlay.SNAKE_PATHS || [];
      for (const sn of SNAKE_PATHS) {
        // Match by tail and head tile center XY
        // But since head/tail tile can overlap (with offset), allow a bit of XY deviation
        const head = sn.head, tail = sn.tail;
        function tileMatch(txy: {x:number;y:number}, pos:number) {
          // find closest tile center to this XY
          const {tileToXY} = require('../../utils/snakeMath');
          const cxy = tileToXY(pos);
          return Math.abs(cxy.x-txy.x) < 18 && Math.abs(cxy.y-txy.y) < 18;
        }
        if (tileMatch(head, fromPos) && tileMatch(tail, toPos)) {
          // Interpolate Bezier for 20 steps
          const pts = [];
          for (let t = 0; t <= 1; t += 0.05) {
            const x = require('../../utils/snakeMath').cubicBezier(
              sn.head.x, sn.mid1.x, sn.mid2.x, sn.tail.x, t
            );
            const y = require('../../utils/snakeMath').cubicBezier(
              sn.head.y, sn.mid1.y, sn.mid2.y, sn.tail.y, t
            );
            pts.push({x, y});
          }
          return pts;
        }
      }
    } catch {}
    return null;
  };

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

    // Snake slide animation: if bitten by a snake, animate token
    if (snakes[newPosition]) {
      const snakeTail = snakes[newPosition];
      const snakePath = getSnakeBodyPath(newPosition, snakeTail);
      if (snakePath && snakePath.length > 0) {
        // Set sliding state, prevent further moves
        setGameState(gs => ({
          ...gs,
          sliding: {
            path: snakePath,
            player: currentPlayer,
          }
        }));
        // Let other moves halt
        await new Promise(res => setTimeout(res, 2000));
        // After 2s slide, actually move the player
        newPosition = snakeTail;
        if (onReaction) onReaction('snake');
      } else {
        newPosition = snakeTail;
        if (onReaction) onReaction('snake');
      }
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
    // Sliding state should be cleared after move
    newGameState.sliding = undefined;

    // Check for win condition
    if (newPosition === 100) {
      newGameState.gameEnded = true;
      newGameState.winner = currentPlayer;
      toast &&
        toast({
          title: '🎉 Congratulations!',
          description:
            (currentPlayer === 'player1'
              ? gameData.player1Nickname || 'Player 1'
              : gameData.player2Nickname || 'Player 2') + ' wins!',
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

    // Multiplayer game state update
    if (isMultiplayer && gameData.onGameStateUpdate) {
      await gameData.onGameStateUpdate(newGameState);
    }

    setIsRolling(false); // FIX: make sure rolling stops after move
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
      sliding: undefined,
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
