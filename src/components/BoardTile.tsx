
interface BoardTileProps {
  tileNumber: number;
  hasPlayer1: boolean;
  hasPlayer2: boolean;
  hasSnake: boolean;
  hasLadder: boolean;
  themeColors: any;
  row: number;
  col: number;
}

const BoardTile = ({ 
  tileNumber, 
  hasPlayer1, 
  hasPlayer2, 
  hasSnake, 
  hasLadder, 
  themeColors,
  row,
  col 
}: BoardTileProps) => {
  // Romantic three-color palette with checkerboard pattern
  const getTileColor = () => {
    if (hasSnake) return 'bg-rose-100/90 border-rose-200';
    if (hasLadder) return 'bg-emerald-100/90 border-emerald-200';
    
    // Three-color checkerboard pattern for romantic aesthetic
    const isEvenTile = tileNumber % 2 === 0;
    const isEvenRow = Math.floor((100 - tileNumber) / 10) % 2 === 0;
    
    if ((isEvenTile && isEvenRow) || (!isEvenTile && !isEvenRow)) {
      // Light romantic tone 1 - blush pink
      return 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100';
    } else if (tileNumber % 3 === 0) {
      // Dark contrasting color - muted navy
      return 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600';
    } else {
      // Light romantic tone 2 - lavender
      return 'bg-gradient-to-br from-purple-50 to-lavender-50 border-purple-100';
    }
  };

  // Determine text color based on background
  const getTextColor = () => {
    if (tileNumber % 3 === 0 && !hasSnake && !hasLadder) {
      return 'text-white'; // White text on dark tiles
    }
    return hasSnake ? 'text-rose-700' : hasLadder ? 'text-emerald-700' : 'text-gray-800';
  };

  // Special emotional milestone tiles
  const isSpecialTile = [5, 58, 87, 93].includes(tileNumber);
  
  return (
    <div 
      className={`
        relative w-12 h-12 flex items-center justify-center
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        ${getTileColor()}
        ${hasPlayer1 || hasPlayer2 ? 'ring-2 ring-white shadow-lg' : 'shadow-sm'}
        ${isSpecialTile ? 'ring-1 ring-pink-200/50' : ''}
      `}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        border: '2px solid',
        borderRadius: '4px',
        borderColor: hasSnake || hasLadder ? 
          (hasSnake ? 'rgb(244 163 163)' : 'rgb(167 243 208)') : 
          'rgb(209 213 219)',
        boxShadow: hasSnake || hasLadder ? 
          '0 4px 12px rgba(0,0,0,0.15)' : 
          '0 2px 6px rgba(0,0,0,0.08)'
      }}
    >
      {/* Large, high-contrast number */}
      <span className={`
        text-sm font-bold drop-shadow-sm select-none
        ${getTextColor()}
      `}>
        {tileNumber}
      </span>
      
      {/* Special milestone hearts for key emotional tiles */}
      {isSpecialTile && (
        <div className="absolute -top-1 -right-1 text-xs">
          💖
        </div>
      )}
      
      {/* Player indicators with romantic styling */}
      {hasPlayer1 && (
        <div className={`
          absolute -top-2 -left-2 w-5 h-5 rounded-full 
          bg-gradient-to-br from-pink-400 to-rose-500
          flex items-center justify-center text-white text-xs font-bold
          ring-2 ring-white shadow-lg animate-pulse
          border border-white/20
        `}>
          1
        </div>
      )}
      
      {hasPlayer2 && (
        <div className={`
          absolute -top-2 -right-2 w-5 h-5 rounded-full 
          bg-gradient-to-br from-purple-400 to-indigo-500
          flex items-center justify-center text-white text-xs font-bold
          ring-2 ring-white shadow-lg animate-pulse
          border border-white/20
        `}>
          2
        </div>
      )}
    </div>
  );
};

export default BoardTile;
