
/**
 * Shared hook/config for snake and ladder tile mapping.
 * Used by overlays, board, and game engine logic—all in one place!
 * 
 * Ladders have been reverted to original/classic configuration per user request.
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
    // Classic/original ladders only (removed ladders added in refactor)
    ladders: {
      1: 38,
      4: 14,
      9: 31,
      21: 42,
      28: 84,
      36: 44,
      51: 67,
      71: 91,
      80: 100,
    },
  };
}
