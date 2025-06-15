
import { Button } from "@/components/ui/button";
import React, { useRef, useEffect } from "react";

// Draw a white dice with black dots, showing the face for a value 1-6
function DiceSVG({ value, rolling }: { value: number; rolling: boolean }) {
  // Dots positions in px (svg 80x80), for each dice value:
  const dot = (x: number, y: number) => (
    <circle cx={x} cy={y} r={6} fill="#111" />
  );
  // Dots per face, using standard dice layout
  const p = {
    1: [dot(40, 40)],
    2: [dot(20, 20), dot(60, 60)],
    3: [dot(20, 20), dot(40, 40), dot(60, 60)],
    4: [dot(20, 20), dot(20, 60), dot(60, 20), dot(60, 60)],
    5: [dot(20, 20), dot(20, 60), dot(60, 20), dot(60, 60), dot(40, 40)],
    6: [dot(20, 20), dot(20, 60), dot(60, 20), dot(60, 60), dot(20, 40), dot(60, 40)]
  };

  // 3D rotation when rolling (animate with CSS)
  return (
    <div
      className={`w-20 h-20 mx-auto flex items-center justify-center
        rounded-2xl shadow-2xl bg-white transition-all
        border-4 border-black relative
        ${rolling ? "animate-dice-3d-spin" : ""}
      `}
      style={{
        perspective: "500px"
      }}
    >
      <svg width={80} height={80}>
        <rect x={2} y={2} width={76} height={76} rx={18} fill="#fff" stroke="#222" strokeWidth={4} />
        {p[value] || p[1]}
      </svg>
    </div>
  );
}

// Custom 3D animation style for dice rolling
const style = `
@keyframes dice-3d-spin {
  0% { transform: rotateX(0deg) rotateY(0deg);}
  30% { transform: rotateX(320deg) rotateY(55deg);}
  60% { transform: rotateX(220deg) rotateY(460deg);}
  80% { transform: rotateX(380deg) rotateY(200deg);}
  100% { transform: rotateX(360deg) rotateY(360deg);}
}
.animate-dice-3d-spin {
  animation: dice-3d-spin 1s cubic-bezier(.35,1.4,.6,1.1);
}
`;

interface DiceControllerProps {
  diceValue: number;
  onClick: () => void;
  disabled: boolean;
}

const DiceController = ({ diceValue, onClick, disabled }: DiceControllerProps) => {
  // Insert rolling style only once (safe in React)
  const didInject = useRef(false);
  useEffect(() => {
    if (didInject.current) return;
    const el = document.createElement("style");
    el.innerHTML = style;
    document.head.appendChild(el);
    didInject.current = true;
  }, []);

  // Track rolling state for dice animation
  const [rolling, setRolling] = React.useState(false);
  useEffect(() => {
    if (disabled) {
      setRolling(true);
    } else {
      setRolling(false);
    }
  }, [disabled]);

  return (
    <div className="text-center space-y-4">
      <div className="relative">
        <DiceSVG value={diceValue} rolling={rolling} />
        {/* subtle white pulse overlay when rolling */}
        {rolling && (
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
        )}
      </div>

      <Button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full py-4 text-lg font-semibold rounded-xl
          bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
          transform transition-all duration-200 hover:scale-105
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:scale-100
        `}
      >
        {rolling ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Rolling...
          </span>
        ) : (
          "Roll Dice"
        )}
      </Button>
    </div>
  );
};

export default DiceController;

