
import { useCallback } from "react";

/**
 * Animates player token sliding from snake head → tail.
 * Returns a sequence of {x, y} points (20 steps) along the snake body for animation.
 * Used in both overlays and game engine.
 */
export function useSnakeBodyPath() {
  return useCallback((fromPos: number, toPos: number) => {
    try {
      // @ts-ignore
      const overlay = require("../../SnakeOverlay");
      const SNAKE_PATHS = overlay.SNAKE_PATHS || [];
      for (const sn of SNAKE_PATHS) {
        function tileMatch(txy: { x: number; y: number }, pos: number) {
          const { tileToXY } = require("../../../utils/snakeMath");
          const cxy = tileToXY(pos);
          return Math.abs(cxy.x - txy.x) < 18 && Math.abs(cxy.y - txy.y) < 18;
        }
        if (tileMatch(sn.head, fromPos) && tileMatch(sn.tail, toPos)) {
          const pts = [];
          for (let t = 0; t <= 1; t += 0.05) {
            const x = require("../../../utils/snakeMath").cubicBezier(
              sn.head.x, sn.mid1.x, sn.mid2.x, sn.tail.x, t
            );
            const y = require("../../../utils/snakeMath").cubicBezier(
              sn.head.y, sn.mid1.y, sn.mid2.y, sn.tail.y, t
            );
            pts.push({ x, y });
          }
          return pts;
        }
      }
    } catch {}
    return null;
  }, []);
}
