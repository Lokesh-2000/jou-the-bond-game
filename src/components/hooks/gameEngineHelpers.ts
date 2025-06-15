import { useSnakeBodyPath } from "./useSnakeBodyPath";
import { useSpecialTiles } from "./useSpecialTiles";
import { GameState } from "./useGameEngine";

/** Contains helpers for common game moves, transitions, and logic */
export function useGameEngineHelpers(gameData: any, gameState: GameState, setGameState: (gs: GameState) => void) {
  const { snakes, ladders } = useSpecialTiles();
  const getSnakeBodyPath = useSnakeBodyPath();

  const isMultiplayer = gameData.isMultiplayer || false;
  const currentPlayerId = gameData.currentPlayerId || 'player1';

  /** No more turn gating, any player can move any time */
  async function rollDiceAndMove({
    onQuestionTriggered,
    onReaction,
    toast,
    isRolling,
    setIsRolling,
  }: {
    onQuestionTriggered?: (arg: string, pos: number) => void,
    onReaction?: (event: 'snake' | 'ladder') => void,
    toast?: (args: any) => void,
    isRolling: boolean,
    setIsRolling: (v: boolean) => void,
  }) {
    if (isRolling || gameState.gameEnded || !gameState.gameStarted) {
      console.log("Blocked dice roll: isRolling", isRolling, "gameEnded", gameState.gameEnded, "gameStarted", gameState.gameStarted);
      return;
    }

    // Detect which player (by ID)
    const thisPlayer = currentPlayerId;
    // Only allow the player to roll for THEMSELVES
    setIsRolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const roll = Math.floor(Math.random() * 6) + 1;
    let newGameState: GameState = { ...gameState, lastDiceRoll: roll };

    const currentPosition =
      thisPlayer === 'player1'
        ? gameState.player1Position
        : gameState.player2Position;
    let newPosition = Math.min(100, currentPosition + roll);

    console.log("Dice rolled:", roll, "by", thisPlayer, "oldPos", currentPosition, "newPos", newPosition);

    if (snakes[newPosition]) {
      const snakeTail = snakes[newPosition];
      const snakePath = getSnakeBodyPath(newPosition, snakeTail);
      if (snakePath && snakePath.length > 0) {
        setGameState({
          ...gameState,
          sliding: {
            path: snakePath,
            player: thisPlayer,
          }
        });
        await new Promise(res => setTimeout(res, 2000));
        newPosition = snakeTail;
        if (onReaction) onReaction('snake');
      } else {
        newPosition = snakeTail;
        if (onReaction) onReaction('snake');
      }
    } else if (ladders[newPosition]) {
      newPosition = ladders[newPosition];
      if (onReaction) onReaction('ladder');
    }

    console.log("Moved to:", newPosition);

    if (thisPlayer === 'player1') {
      newGameState.player1Position = newPosition;
    } else {
      newGameState.player2Position = newPosition;
    }
    newGameState.sliding = undefined;

    // Win condition
    if (newPosition === 100) {
      newGameState.gameEnded = true;
      newGameState.winner = thisPlayer;
      toast &&
        toast({
          title: '🎉 Congratulations!',
          description:
            (thisPlayer === 'player1'
              ? gameData.player1Nickname || 'Player 1'
              : gameData.player2Nickname || 'Player 2') + ' wins!',
        });
    } else {
      // Question triggers
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
      // No need to switch turns
    }

    setGameState(newGameState);

    if (isMultiplayer && gameData.onGameStateUpdate) {
      await gameData.onGameStateUpdate(newGameState);
    }

    setIsRolling(false);
  }

  function handleNewGame() {
    if (isMultiplayer) return;
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
  }

  function handleTileClick(position: number, toast?: (args: any) => void) {
    if (!gameState.gameEnded) return;
    toast &&
      toast({
        title: 'Tile Info',
        description: `Tile ${position}`,
      });
  }

  return {
    getSpecialTiles: () => ({ snakes, ladders }),
    rollDiceAndMove,
    handleNewGame,
    handleTileClick,
    isMultiplayer,
    currentPlayerId,
  };
}
