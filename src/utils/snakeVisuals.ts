
export interface SnakeVisual {
  id: number;
  headTile: number;
  tailTile: number;
  imageUrl: string;
  rotation: number;
  scale: number;
}

export const getSnakeVisuals = (relationshipType: string): SnakeVisual[] => {
  // Updated snake positions based on user specifications
  const snakePositions = {
    38: 15,
    29: 8,
    47: 19,
    53: 35,
    62: 55,
    86: 54,
    92: 70,
    94: 6,
    97: 78,
    82: 65
  };

  // Available snake images
  const snakeImages = [
    '/lovable-uploads/f94f84ea-a95b-4a19-b505-280a2b0a3dd5.png', // Blue with green pattern
    '/lovable-uploads/bf0a357b-08c2-4597-9242-de512e39a502.png', // Green
    '/lovable-uploads/e6f75d41-4931-4b0c-99a5-67fe301e9eb1.png', // Green with red pattern
    '/lovable-uploads/2302e7cb-0ce6-4297-85ef-021bc2d391c3.png', // Pink with blue pattern
    '/lovable-uploads/9216d008-9f9d-4bb9-a95d-f3d38e4ef7cb.png', // Purple with teal
    '/lovable-uploads/11f6227d-83bd-4976-875a-aa32e29d89f9.png', // Green striped
    '/lovable-uploads/dd6583ce-8213-49ea-88fb-0983f4853e2c.png', // Green striped variant
    '/lovable-uploads/0a65f3a0-cc60-47fa-9413-4f904a82a716.png', // Teal with yellow
    '/lovable-uploads/5ac12cd5-bb5d-4d2d-8972-847750f0aedb.png', // Blue simple
    '/lovable-uploads/0a931bda-c040-4876-8446-2e9de9c3175e.png'  // Purple cosmic
  ];

  // Create visual snake data
  const snakeVisuals: SnakeVisual[] = Object.entries(snakePositions).map(([head, tail], index) => {
    const headTile = parseInt(head);
    const tailTile = tail;
    const imageIndex = index % snakeImages.length;
    
    return {
      id: index,
      headTile,
      tailTile,
      imageUrl: snakeImages[imageIndex],
      rotation: Math.random() * 30 - 15, // Random rotation between -15 and 15 degrees
      scale: 0.8 + Math.random() * 0.4 // Random scale between 0.8 and 1.2
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
