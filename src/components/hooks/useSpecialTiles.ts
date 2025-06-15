
/**
 * Shared hook/config for snake and ladder tile mapping.
 * Used by overlays, board, and game engine logic—all in one place!
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
    ladders: {
      1: 38,
      4: 14,
      5: 58,
      9: 27,
      21: 42,
      28: 84,
      33: 87,
      36: 44,
      40: 64,
      51: 73,
      61: 81,
      71: 91,
      76: 84,
      80: 100,
    },
  };
}
