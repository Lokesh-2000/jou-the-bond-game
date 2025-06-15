
import { useSnakeBodyPath } from "./useSnakeBodyPath";
import { useSpecialTiles } from "./useSpecialTiles";
import { GameState } from "./useGameEngine";

/** Contains helpers for common game moves, transitions, and logic */
export function useGameEngineHelpers(gameData: any, gameState: GameState, setGameState: (gs: GameState) => void) {
  const { snakes, ladders } = useSpecialTiles();
  const getSnakeBodyPath = useSnakeBodyPath();

  const isMultiplayer = gameData.isMultiplayer || false;
  const currentPlayerId = gameData.currentPlayerId || 'player1';

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
    if (isMultiplayer && gameState.currentTurn !== currentPlayerId) {
      console.log("Blocked: Not this player's turn.", { currentPlayerId, currentTurn: gameState.currentTurn });
      return;
    }

    setIsRolling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const roll = Math.floor(Math.random() * 6) + 1;
    const newGameState = { ...gameState, lastDiceRoll: roll };

    // Move player
    const currentPlayer = gameState.currentTurn;
    const currentPosition =
      currentPlayer === 'player1'
        ? gameState.player1Position
        : gameState.player2Position;
    let newPosition = Math.min(100, currentPosition + roll);

    console.log("Dice rolled:", roll, "by", currentPlayer, "oldPos", currentPosition, "newPos", newPosition);

    if (snakes[newPosition]) {
      const snakeTail = snakes[newPosition];
      const snakePath = getSnakeBodyPath(newPosition, snakeTail);
      if (snakePath && snakePath.length > 0) {
        setGameState(gs => ({
          ...gs,
          sliding: {
            path: snakePath,
            player: currentPlayer,
          }
        }));
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

    if (currentPlayer === 'player1') {
      newGameState.player1Position = newPosition;
    } else {
      newGameState.player2Position = newPosition;
    }
    newGameState.sliding = undefined;

    // Win condition
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
      // Switch turns
      newGameState.currentTurn =
        currentPlayer === 'player1' ? 'player2' : 'player1';
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
