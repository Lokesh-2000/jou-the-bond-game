
/**
 * Shared hook/config for snake and ladder tile mapping.
 * Used by overlays, board, and game engine logic—all in one place!
 * 
 * Ladders are now set to user-specified positions.
 */
export function useSpecialTiles() {
  return {
    snakes: {
      16: 6,
      29: 8,
      38: 15,
      47: 26,
      49: 11,
      53: 31,
      56: 53,
      62: 19,
      64: 60,
      82: 65,
      86: 54,
      87: 24,
      88: 24,
      92: 70,
      93: 73,
      94: 6,
      95: 75,
      97: 78,
      98: 78,
    },
    // Updated as per user request
    ladders: {
      5: 57,
      9: 27,
      33: 87,
      40: 64,
      51: 73,
      61: 81,
      76: 84,
    },
  };
}
