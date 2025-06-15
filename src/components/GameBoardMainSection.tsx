
import GameBoardGrid from "./GameBoardGrid";
import BoardChatArea from "./BoardChatArea";

interface GameBoardMainSectionProps {
  gameState: any;
  gameData: any;
  roomCode?: string;
  showChat: boolean;
  handleTileClick: (pos: number, toast?: (args: any) => void) => void;
}

const GameBoardMainSection = ({
  gameState,
  gameData,
  roomCode,
  showChat,
  handleTileClick,
}: GameBoardMainSectionProps) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <GameBoardGrid
        player1Position={gameState.player1Position}
        player2Position={gameState.player2Position}
        onTileClick={(pos) => handleTileClick(pos)}
        sliding={gameState.sliding}
      />
      {showChat && (
        <BoardChatArea gameData={gameData} roomCode={roomCode} />
      )}
    </div>
  );
};

export default GameBoardMainSection;
