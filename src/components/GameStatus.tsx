
import { Badge } from "@/components/ui/badge";

interface GameStatusProps {
  currentPlayer: number;
  playerPositions: { player1: number; player2: number };
  roomCode: string;
  themeColors: any;
}

const GameStatus = ({ currentPlayer, playerPositions, roomCode, themeColors }: GameStatusProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Turn</h3>
        <Badge className={`
          text-lg py-2 px-4 rounded-xl font-bold
          ${currentPlayer === 1 ? themeColors.player1 : themeColors.player2}
          shadow-lg transform transition-all duration-200 hover:scale-105
        `}>
          Player {currentPlayer}
        </Badge>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-gray-700 text-center">Positions</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded-lg bg-white/50">
            <span className="font-medium">Player 1:</span>
            <Badge className={`${themeColors.player1} font-bold`}>
              {playerPositions.player1}
            </Badge>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-white/50">
            <span className="font-medium">Player 2:</span>
            <Badge className={`${themeColors.player2} font-bold`}>
              {playerPositions.player2}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-2">Game Rules</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <span className="text-lg">🐍</span> 
            <span>Snake = Answer Question</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-lg">🪜</span> 
            <span>Ladder = Move Up</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-lg">🎲</span> 
            <span>Roll 6 to start & extra turn</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
