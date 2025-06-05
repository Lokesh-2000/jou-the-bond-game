
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
  // Romantic pastel color scheme for tiles
  const getTileColor = () => {
    if (hasSnake) return 'bg-rose-100/80 border-rose-200/60';
    if (hasLadder) return 'bg-emerald-100/80 border-emerald-200/60';
    
    // Alternating soft pastel pattern for romantic aesthetic
    const isEvenTile = tileNumber % 2 === 0;
    const isEvenRow = Math.floor((100 - tileNumber) / 10) % 2 === 0;
    
    if ((isEvenTile && isEvenRow) || (!isEvenTile && !isEvenRow)) {
      return 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100/50';
    } else {
      return 'bg-gradient-to-br from-blue-50 to-lavender-50 border-blue-100/50';
    }
  };

  // Special emotional milestone tiles
  const isSpecialTile = [5, 58, 87, 93].includes(tileNumber);
  
  return (
    <div 
      className={`
        relative w-12 h-12 border-2 flex items-center justify-center
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        ${getTileColor()}
        ${hasPlayer1 || hasPlayer2 ? 'ring-2 ring-white shadow-lg' : 'shadow-sm'}
        ${isSpecialTile ? 'ring-1 ring-pink-200/50' : ''}
      `}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        borderRadius: '6px',
        boxShadow: hasSnake || hasLadder ? 
          '0 4px 12px rgba(0,0,0,0.15)' : 
          '0 2px 6px rgba(0,0,0,0.08)'
      }}
    >
      {/* Large, high-contrast number */}
      <span className={`
        text-sm font-bold drop-shadow-sm select-none
        ${hasSnake ? 'text-rose-700' : hasLadder ? 'text-emerald-700' : 'text-gray-700'}
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
