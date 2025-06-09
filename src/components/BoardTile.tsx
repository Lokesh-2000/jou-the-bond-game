
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
  // Two-color alternating pattern: light grey and light pink
  const getTileColor = () => {
    if (hasSnake) return 'bg-rose-100/90';
    if (hasLadder) return 'bg-emerald-100/90';
    
    // Alternating pattern between light grey and light pink
    const isEvenTile = tileNumber % 2 === 0;
    return isEvenTile ? 'bg-gray-200' : 'bg-pink-200';
  };

  // Text color based on background
  const getTextColor = () => {
    if (hasSnake) return 'text-rose-700';
    if (hasLadder) return 'text-emerald-700';
    return 'text-gray-800';
  };

  // Special emotional milestone tiles
  const isSpecialTile = [5, 58, 87, 93].includes(tileNumber);
  
  return (
    <div 
      className={`
        relative w-16 h-16 flex items-center justify-center
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        ${getTileColor()}
        ${hasPlayer1 || hasPlayer2 ? 'ring-2 ring-white shadow-lg' : 'shadow-sm'}
        ${isSpecialTile ? 'ring-1 ring-pink-200/50' : ''}
      `}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        border: '3.5px solid black',
        borderRadius: '0px',
        boxShadow: hasSnake || hasLadder ? 
          '0 4px 12px rgba(0,0,0,0.15)' : 
          '0 2px 6px rgba(0,0,0,0.08)'
      }}
    >
      {/* Large, high-contrast number */}
      <span className={`
        text-base font-bold drop-shadow-sm select-none
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
          absolute -top-2 -left-2 w-6 h-6 rounded-full 
          bg-gradient-to-br from-pink-400 to-rose-500
          flex items-center justify-center text-white text-sm font-bold
          ring-2 ring-white shadow-lg animate-pulse
          border border-white/20
        `}>
          1
        </div>
      )}
      
      {hasPlayer2 && (
        <div className={`
          absolute -top-2 -right-2 w-6 h-6 rounded-full 
          bg-gradient-to-br from-purple-400 to-indigo-500
          flex items-center justify-center text-white text-sm font-bold
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
