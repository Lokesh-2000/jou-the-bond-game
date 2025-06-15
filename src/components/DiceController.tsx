
import { Button } from "@/components/ui/button";
import React, { useRef, useEffect } from "react";

// Draw a white dice with black dots, showing the face for a value 1-6
function DiceSVG({ value, rolling, onClick, disabled }: { value: number; rolling: boolean; onClick: () => void; disabled: boolean }) {
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
      className={`w-20 h-20 mx-auto flex items-center justify-center rounded-2xl shadow-2xl bg-white transition-all border-4 border-black relative
        ${rolling ? "animate-dice-3d-spin" : ""}
        ${!disabled ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "cursor-not-allowed"}
      `}
      style={{
        perspective: "500px"
      }}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={disabled ? "Dice rolling" : "Roll the dice"}
    >
      <svg width={80} height={80}>
        <rect x={2} y={2} width={76} height={76} rx={18} fill="#fff" stroke="#222" strokeWidth={4} />
        {p[value] || p[1]}
      </svg>
      {/* subtle white pulse overlay when rolling */}
      {rolling && (
        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
      )}
      {/* Show overlay text when rolling */}
      {rolling && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xl font-semibold text-black opacity-70 animate-fade-in">Rolling...</span>
        </div>
      )}
      {/* Pulse border to hint clickable */}
      {!disabled && !rolling && (
        <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/70 animate-pulse pointer-events-none" aria-hidden />
      )}
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

  // Fix dice: only animate as rolling when disabled *and* the click just happened.
  useEffect(() => {
    if (disabled) {
      setRolling(true);
    } else {
      // Wait for animation to end, then set rolling to false
      const timeout = setTimeout(() => setRolling(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [disabled]);

  // Listen to keyboard (Enter/Space) for accessibility
  const handleDiceKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && (e.key === " " || e.key === "Enter")) {
      onClick();
    }
  };

  return (
    <div className="text-center space-y-4">
      <DiceSVG
        value={diceValue}
        rolling={rolling}
        onClick={onClick}
        disabled={disabled}
        // Consider passing handleDiceKey for tab accessibility if needed
      />
      {/* No button or line below */}
    </div>
  );
};

export default DiceController;
