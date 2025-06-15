
import PlayerInfo from "./PlayerInfo";
import GameControls from "./GameControls";

interface GameBoardSidebarProps {
  player1Name: string;
  player2Name: string;
  currentTurn: string;
  player1Position: number;
  player2Position: number;
  isMultiplayer: boolean;
  currentPlayerId: string;
  gameEnded: boolean;
  winner: string | null;
  lastDiceRoll: number;
  onRollDice: () => void;
  onNewGame: () => void;
  isWaitingForOtherPlayer: boolean;
  isTurn: boolean;
}

const GameBoardSidebar = (props: GameBoardSidebarProps) => (
  <div className="space-y-6">
    <PlayerInfo
      player1Name={props.player1Name}
      player2Name={props.player2Name}
      currentTurn={props.currentTurn}
      player1Position={props.player1Position}
      player2Position={props.player2Position}
      isMultiplayer={props.isMultiplayer}
      currentPlayerId={props.currentPlayerId}
    />
    <GameControls
      currentTurn={props.currentTurn}
      gameEnded={props.gameEnded}
      winner={props.winner}
      lastDiceRoll={props.lastDiceRoll}
      onRollDice={props.onRollDice}
      onNewGame={props.onNewGame}
      isMultiplayer={props.isMultiplayer}
      currentPlayerId={props.currentPlayerId}
      isWaitingForOtherPlayer={props.isWaitingForOtherPlayer}
      isTurn={props.isTurn}
    />
  </div>
);

export default GameBoardSidebar;
