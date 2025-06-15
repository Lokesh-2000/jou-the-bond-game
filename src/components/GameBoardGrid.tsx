
import React, { useEffect, useRef, useState } from 'react';
import BoardTile from './BoardTile';
import SnakeOverlay, { SNAKES, SNAKE_PATHS } from './SnakeOverlay';
import LadderOverlay from './LadderOverlay';

// Utility to determine if tile has a snake or ladder (for board rendering)
const getSpecialTiles = () => ({
  snakes: {
    38: 15, 47: 19, 53: 31, 62: 55, 86: 54, 88: 24, 92: 70, 94: 6, 97: 78, 82: 65, 29: 8,
  },
  ladders: {
    5: 58, 9: 27, 33: 87, 40: 64, 51: 73, 61: 81, 76: 84,
  }
});

interface GameBoardGridProps {
  player1Position: number;
  player2Position: number;
  onTileClick: (position: number) => void;
  sliding?: {
    path: { x: number; y: number }[],
    player: 'player1' | 'player2'
  }
}

// Helper: find which snake is currently sliding (returns color + path for effect)
function getSlidingSnake(playerPos: number, sliding: GameBoardGridProps['sliding']) {
  if (!sliding || !sliding.path?.length) return null;
  return sliding;
}

const GameBoardGrid = ({
  player1Position,
  player2Position,
  onTileClick,
  sliding
}: GameBoardGridProps) => {
  const { snakes, ladders } = getSpecialTiles();

  // 10x10 board, 1 at bottom-left to 10 at bottom-right
  // 91-100 is top row (left to right), so 100 is top-left
  const createBoard = () => {
    const tiles = [];
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        // Even row (from bottom): left to right, Odd: right to left
        const isEvenRow = row % 2 === 0;
        const position = isEvenRow
          ? row * 10 + (col + 1)     // left to right
          : row * 10 + (10 - col);  // right to left

        // If sliding, put no marker at head
        let hasPlayer1 = !sliding?.player || sliding.player !== 'player1' ? player1Position === position : false;
        let hasPlayer2 = !sliding?.player || sliding.player !== 'player2' ? player2Position === position : false;
        const hasSnake = snakes.hasOwnProperty(position);
        const hasLadder = ladders.hasOwnProperty(position);

        tiles.push(
          <BoardTile
            key={position}
            tileNumber={position}
            hasPlayer1={hasPlayer1}
            hasPlayer2={hasPlayer2}
            hasSnake={hasSnake}
            hasLadder={hasLadder}
            themeColors={null}
            row={9-row} // grid row 1 at bottom
            col={col}
          />
        );
      }
    }
    return tiles;
  };

  // Animate player token sliding along snake path if sliding is active
  function AnimatedToken({ path, color = "#e15456", zIndex, tokenClass }: { path: any[], color?: string, zIndex?: number, tokenClass?: string }) {
    const [step, setStep] = useState(0);
    const refStep = useRef(0);
    useEffect(() => {
      refStep.current = 0;
      setStep(0);
      if (!path?.length) return;
      let mounted = true;
      const steps = path.length - 1;
      const interval = 2000 / steps; // total 2s
      const frame = () => {
        if (!mounted) return;
        setStep((old) => {
          const next = old + 1;
          refStep.current = next;
          if (next < path.length - 1)
            setTimeout(frame, interval);
          return next;
        });
      };
      setTimeout(frame, interval);
      return () => { mounted = false; };
    }, [path]);

    if (!path || path.length < 1) return null;
    const { x, y } = path[Math.min(step, path.length - 1)];

    // Player token is a colored disc with shadow (matches previous tokens)
    return (
      <svg
        width={0}
        height={0}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: zIndex ?? 19,
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
      >
        <circle
          cx={x}
          cy={y}
          r={22}
          fill={color}
          style={{
            filter: "drop-shadow(0 2px 10px #2e222444)"
          }}
          className={tokenClass}
        />
      </svg>
    );
  }

  // If sliding, render sliding token
  return (
    <div
      className="relative mx-auto rounded-lg border-[3px] border-black shadow-xl aspect-square bg-white overflow-visible"
      style={{
        width: 'min(95vw, 95vh, 640px)',
        maxWidth: '100vw',
        maxHeight: '100vw'
      }}
    >
      {/* Overlays */}
      <SnakeOverlay />
      <LadderOverlay />
      {/* Sliding tokens */}
      {sliding?.path && sliding.player === 'player1' && (
        <AnimatedToken path={sliding.path} color="#e15456" zIndex={21} tokenClass="drop-shadow-md" />
      )}
      {sliding?.path && sliding.player === 'player2' && (
        <AnimatedToken path={sliding.path} color="#578af4" zIndex={21} tokenClass="drop-shadow-md" />
      )}
      {/* Tiles */}
      <div
        className="grid grid-rows-10 grid-cols-10 w-full h-full"
        style={{
          minWidth: '640px', // ensures SVG overlays match grid
          minHeight: '640px',
        }}
      >
        {createBoard()}
      </div>
    </div>
  );
};

export default GameBoardGrid;
