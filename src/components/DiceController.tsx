
import { Button } from "@/components/ui/button";

interface DiceControllerProps {
  diceValue: number;
  isRolling: boolean;
  onRollDice: () => void;
  themeColors: any;
}

const DiceController = ({ diceValue, isRolling, onRollDice, themeColors }: DiceControllerProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="relative">
        <div className={`
          w-20 h-20 mx-auto rounded-2xl shadow-2xl
          ${themeColors.dice} 
          flex items-center justify-center text-3xl font-bold text-white
          transform transition-all duration-200
          ${isRolling ? 'animate-spin scale-110' : 'hover:scale-105'}
          border-4 border-white/20
        `}>
          {diceValue}
        </div>
        {isRolling && (
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
        )}
      </div>
      
      <Button 
        onClick={onRollDice}
        disabled={isRolling}
        className={`
          w-full py-4 text-lg font-semibold rounded-xl
          ${themeColors.button}
          transform transition-all duration-200 hover:scale-105
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:scale-100
        `}
      >
        {isRolling ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Rolling...
          </span>
        ) : (
          'Roll Dice'
        )}
      </Button>
    </div>
  );
};

export default DiceController;
