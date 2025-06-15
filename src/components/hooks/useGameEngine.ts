
import { useState, useEffect } from 'react';
import { useSpecialTiles } from "./useSpecialTiles";
import { useGameEngineHelpers } from "./gameEngineHelpers";

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
  const [isRolling, setIsRolling] = useState(false);

  const { getSpecialTiles, rollDiceAndMove, handleNewGame, handleTileClick, isMultiplayer, currentPlayerId } = useGameEngineHelpers(gameData, gameState, setGameState);

  // Sync external game state
  useEffect(() => {
    if (gameData.gameState) {
      setGameState(gameData.gameState);
    }
  }, [gameData.gameState]);

  // Multiplayer: start game when both players present
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

  // --- Debug logs
  useEffect(() => {
    console.log("Current gameState:", gameState);
  }, [gameState]);
  useEffect(() => {
    console.log("Is rolling?", isRolling);
  }, [isRolling]);
  // ---

  // Wrap rollDiceAndMove with isRolling tracking
  const rollDiceAndMoveWithState = async (args: any) => {
    await rollDiceAndMove({
      ...args,
      isRolling,
      setIsRolling,
    });
  };

  return {
    gameState,
    setGameState,
    isRolling,
    rollDiceAndMove: rollDiceAndMoveWithState,
    handleNewGame,
    handleTileClick,
    getSpecialTiles,
    isMultiplayer,
    currentPlayerId,
  };
};
