
import { getTilePosition } from '@/utils/snakeVisuals';

interface LadderOverlayProps {
  relationshipType: string;
}

interface LadderVisual {
  id: number;
  startTile: number;
  endTile: number;
  imageUrl: string;
}

const LadderOverlay = ({ relationshipType }: LadderOverlayProps) => {
  // Ladder positions for emotional growth narrative
  const ladderPositions = {
    5: 58,
    9: 27,
    33: 87,
    40: 64,
    57: 73,
    63: 81,
    75: 93
  };

  // Available ladder images
  const ladderImages = [
    '/lovable-uploads/d5e601ca-0bb2-4a5e-a22c-7fe3d96d1f9e.png',
    '/lovable-uploads/a9510091-d978-466f-a3ad-70c61c0fefe7.png',
    '/lovable-uploads/53014261-2b7f-42e2-945f-386a3e8b0c78.png',
    '/lovable-uploads/10471ca8-8a74-455f-8dc9-ca0c8945ba55.png',
    '/lovable-uploads/da65701c-0478-4119-954a-f3caa6ab67d6.png',
    '/lovable-uploads/2f52bb8c-5549-4d55-a850-290dd9c42f33.png',
    '/lovable-uploads/e099ae59-7b02-4aa8-92a1-01fbb53ecd40.png'
  ];

  const ladderVisuals: LadderVisual[] = Object.entries(ladderPositions).map(([start, end], index) => ({
    id: index,
    startTile: parseInt(start),
    endTile: end,
    imageUrl: ladderImages[index % ladderImages.length]
  }));

  const calculateLadderPath = (startTile: number, endTile: number) => {
    const startPos = getTilePosition(startTile);
    const endPos = getTilePosition(endTile);
    
    // Calculate the path between start and end with precise positioning
    const deltaX = endPos.x - startPos.x;
    const deltaY = endPos.y - startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Center the ladder exactly between the two tiles
    const centerX = (startPos.x + endPos.x) / 2;
    const centerY = (startPos.y + endPos.y) / 2;
    
    // Ensure ladder doesn't extend beyond board boundaries
    const maxWidth = Math.min(distance, 300); // Limit max width
    const height = 24; // Reduced height to stay within tiles
    
    return {
      x: centerX,
      y: centerY,
      width: maxWidth,
      height: height,
      rotation: angle
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {ladderVisuals.map((ladder) => {
        const path = calculateLadderPath(ladder.startTile, ladder.endTile);
        
        return (
          <div
            key={ladder.id}
            className="absolute"
            style={{
              left: path.x - path.width / 2,
              top: path.y - path.height / 2,
              width: path.width,
              height: path.height,
              transform: `rotate(${path.rotation}deg)`,
              transformOrigin: 'center',
              zIndex: 4
            }}
          >
            <img
              src={ladder.imageUrl}
              alt={`Ladder ${ladder.id}`}
              className="w-full h-full object-contain opacity-90"
              style={{
                filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.2))'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LadderOverlay;
