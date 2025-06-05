
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
  return (
    <div 
      className={`
        relative w-12 h-12 border border-white/30 flex items-center justify-center text-xs font-bold
        backdrop-blur-sm rounded-lg transition-all duration-200 hover:scale-105
        ${themeColors.board}
        ${hasSnake ? 'bg-red-500/20 border-red-400/50' : ''}
        ${hasLadder ? 'bg-green-500/20 border-green-400/50' : ''}
        ${hasPlayer1 || hasPlayer2 ? 'ring-2 ring-white/50' : ''}
      `}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1
      }}
    >
      <span className="text-white text-shadow-sm drop-shadow-md font-semibold">
        {tileNumber}
      </span>
      
      {hasPlayer1 && (
        <div className={`
          absolute -top-2 -left-2 w-5 h-5 rounded-full 
          ${themeColors.player1} 
          flex items-center justify-center text-white text-xs font-bold
          ring-2 ring-white shadow-lg animate-pulse
        `}>
          1
        </div>
      )}
      
      {hasPlayer2 && (
        <div className={`
          absolute -top-2 -right-2 w-5 h-5 rounded-full 
          ${themeColors.player2} 
          flex items-center justify-center text-white text-xs font-bold
          ring-2 ring-white shadow-lg animate-pulse
        `}>
          2
        </div>
      )}
    </div>
  );
};

export default BoardTile;
