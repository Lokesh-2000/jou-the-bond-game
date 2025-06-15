
import { useState } from "react";

export function useReactionModal() {
  const [showReaction, setShowReaction] = useState(false);
  const [reactionType, setReactionType] = useState<'snake' | 'ladder'>('snake');
  const handleShowReaction = (type: 'snake' | 'ladder') => {
    setReactionType(type);
    setShowReaction(true);
  };
  const handleCloseReaction = () => setShowReaction(false);

  return {
    showReaction,
    reactionType,
    handleShowReaction,
    handleCloseReaction,
  };
}
