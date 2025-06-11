
import { Badge } from "@/components/ui/badge";

interface GameStatusProps {
  roomCode?: string;
}

const GameStatus = ({ roomCode }: GameStatusProps) => {
  return (
    <div className="space-y-6">
      {roomCode && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 mb-2">Room Code</h4>
          <div className="text-center">
            <Badge className="text-lg py-2 px-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {roomCode}
            </Badge>
          </div>
        </div>
      )}

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
