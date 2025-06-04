
export interface ThemeColors {
  background: string;
  board: string;
  player1: string;
  player2: string;
  dice: string;
  button: string;
}

export const getThemeColors = (relationshipType: string): ThemeColors => {
  switch (relationshipType) {
    case 'friend':
      return {
        background: 'bg-gradient-to-br from-green-50 via-yellow-50 to-green-100',
        board: 'bg-green-50 hover:bg-green-100',
        player1: 'bg-green-500',
        player2: 'bg-yellow-500',
        dice: 'bg-green-600',
        button: 'bg-green-600 hover:bg-green-700 text-white'
      };
    
    case 'lover':
      return {
        background: 'bg-gradient-to-br from-pink-50 via-red-50 to-pink-100',
        board: 'bg-pink-50 hover:bg-pink-100',
        player1: 'bg-pink-500',
        player2: 'bg-red-500',
        dice: 'bg-pink-600',
        button: 'bg-pink-600 hover:bg-pink-700 text-white'
      };
    
    case 'crush':
      return {
        background: 'bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-100',
        board: 'bg-purple-50 hover:bg-purple-100',
        player1: 'bg-purple-500',
        player2: 'bg-yellow-500',
        dice: 'bg-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      };
    
    case 'stranger':
      return {
        background: 'bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100',
        board: 'bg-blue-50 hover:bg-blue-100',
        player1: 'bg-blue-500',
        player2: 'bg-gray-600',
        dice: 'bg-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    
    case 'complicated':
      return {
        background: 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100',
        board: 'bg-gray-50 hover:bg-gray-100',
        player1: 'bg-gray-500',
        player2: 'bg-purple-400',
        dice: 'bg-gray-600',
        button: 'bg-gray-600 hover:bg-gray-700 text-white'
      };
    
    default:
      return {
        background: 'bg-gradient-to-br from-blue-50 via-white to-blue-100',
        board: 'bg-blue-50 hover:bg-blue-100',
        player1: 'bg-blue-500',
        player2: 'bg-cyan-500',
        dice: 'bg-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
  }
};
