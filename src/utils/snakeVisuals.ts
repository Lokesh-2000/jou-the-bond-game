
export interface SnakeVisual {
  id: number;
  headTile: number;
  tailTile: number;
  imageUrl: string;
  rotation: number;
  scale: number;
}

export const getSnakeVisuals = (relationshipType: string): SnakeVisual[] => {
  // Updated snake positions for emotional pitfalls narrative
  const snakePositions = {
    38: 15,
    47: 19,
    53: 35,
    62: 55,
    86: 54,
    92: 70,
    94: 6,
    97: 78,
    82: 65,
    29: 8
  };

  // Updated snake images with your new romantic-themed snakes
  const snakeImages = [
    '/lovable-uploads/3a5a1ee6-6988-4949-a893-127c8d18d42b.png', // Blue with green pattern
    '/lovable-uploads/eb2c3da6-00a9-4159-8760-19c95bd034b3.png', // Soft green
    '/lovable-uploads/204acf49-5006-4fc7-bc22-fc19f073af75.png', // Green with red pattern
    '/lovable-uploads/3368fbe9-8a99-449d-9e0d-5ac7958212cb.png', // Pink with blue pattern
    '/lovable-uploads/ec8c2aaf-e6d7-4e37-865a-063afc44bb8c.png', // Purple cosmic
    '/lovable-uploads/fdbfa81e-42b5-473f-80fb-77810e332f87.png', // Green striped
    '/lovable-uploads/6e074d25-3767-4345-97d1-63dc90c88ca4.png', // Green striped variant
    '/lovable-uploads/c3142509-c7c0-4c02-9914-0d0854c553f2.png', // Teal with yellow
    '/lovable-uploads/d940a652-6fe8-42ea-8cdb-3b4e8a55953e.png', // Blue simple
    '/lovable-uploads/ed9d841e-de43-4ed3-982a-9b6d307b4e85.png'  // Purple cosmic variant
  ];

  // Create visual snake data with more consistent positioning
  const snakeVisuals: SnakeVisual[] = Object.entries(snakePositions).map(([head, tail], index) => {
    const headTile = parseInt(head);
    const tailTile = tail;
    const imageIndex = index % snakeImages.length;
    
    return {
      id: index,
      headTile,
      tailTile,
      imageUrl: snakeImages[imageIndex],
      rotation: Math.random() * 20 - 10, // Reduced rotation for better alignment
      scale: 0.9 + Math.random() * 0.2 // More consistent scaling between 0.9 and 1.1
    };
  });

  return snakeVisuals;
};

export const getTilePosition = (tileNumber: number) => {
  const row = Math.floor((100 - tileNumber) / 10);
  const isEvenRow = row % 2 === 0;
  const col = isEvenRow ? (100 - tileNumber) % 10 : 9 - ((100 - tileNumber) % 10);
  
  return {
    row: row + 1,
    col: col + 1,
    x: col * 48 + 24, // 48px tile width + 24px for center
    y: row * 48 + 24  // 48px tile height + 24px for center
  };
};
