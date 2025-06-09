
import { getSnakeVisuals, getTilePosition } from '@/utils/snakeVisuals';

interface SnakeOverlayProps {
  relationshipType: string;
}

const SnakeOverlay = ({ relationshipType }: SnakeOverlayProps) => {
  const snakeVisuals = getSnakeVisuals(relationshipType);

  const calculateSnakePath = (headTile: number, tailTile: number) => {
    const headPos = getTilePosition(headTile);
    const tailPos = getTilePosition(tailTile);
    
    // Calculate the path between head and tail with precise positioning
    const deltaX = tailPos.x - headPos.x;
    const deltaY = tailPos.y - headPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Center the snake exactly between the two tiles
    const centerX = (headPos.x + tailPos.x) / 2;
    const centerY = (headPos.y + tailPos.y) / 2;
    
    return {
      x: centerX,
      y: centerY,
      width: distance,
      height: 32,
      rotation: angle
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {snakeVisuals.map((snake) => {
        const path = calculateSnakePath(snake.headTile, snake.tailTile);
        
        return (
          <div
            key={snake.id}
            className="absolute"
            style={{
              left: path.x - path.width / 2,
              top: path.y - path.height / 2,
              width: path.width,
              height: path.height,
              transform: `rotate(${path.rotation}deg) scale(${snake.scale})`,
              transformOrigin: 'center',
              zIndex: 5
            }}
          >
            <img
              src={snake.imageUrl}
              alt={`Snake ${snake.id}`}
              className="w-full h-full object-contain opacity-85"
              style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.25))'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SnakeOverlay;
