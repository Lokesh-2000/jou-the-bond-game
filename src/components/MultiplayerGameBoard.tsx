
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { sessionManager, Session, GameState } from '@/utils/sessionManager';
import GameBoard from './GameBoard';

interface MultiplayerGameBoardProps {
  sessionId: string;
  playerId: string;
  nickname: string;
  isPlayer2?: boolean;
  gameData: any;
}

const MultiplayerGameBoard = ({ 
  sessionId, 
  playerId, 
  nickname, 
  isPlayer2 = false,
  gameData 
}: MultiplayerGameBoardProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [localGameData, setLocalGameData] = useState(gameData);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSession();
    
    // Subscribe to session updates
    sessionManager.subscribeToSession(sessionId, handleSessionUpdate);

    return () => {
      sessionManager.unsubscribeFromSession();
    };
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const sessionData = await sessionManager.getSession(sessionId);
      if (sessionData) {
        setSession(sessionData);
        
        // Update local game data with session data
        setLocalGameData({
          ...gameData,
          relationshipType: sessionData.relationship_type,
          conversationStyles: sessionData.conversation_styles,
          customQuestion: sessionData.custom_question,
          sessionId: sessionData.session_id,
          player1Nickname: sessionData.player1_nickname,
          player2Nickname: sessionData.player2_nickname,
          gameState: sessionData.game_state
        });
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Connection Error",
        description: "Failed to load game session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSessionUpdate = (updatedSession: Session) => {
    console.log('Session updated:', updatedSession);
    setSession(updatedSession);
    
    // Update local game data with new session state
    setLocalGameData(prev => ({
      ...prev,
      gameState: updatedSession.game_state,
      player1Nickname: updatedSession.player1_nickname,
      player2Nickname: updatedSession.player2_nickname
    }));

    // Show toast for game events
    if (updatedSession.game_state.game_ended && updatedSession.game_state.winner) {
      const isWinner = (isPlayer2 && updatedSession.game_state.winner === 'player2') ||
                      (!isPlayer2 && updatedSession.game_state.winner === 'player1');
      
      toast({
        title: isWinner ? "🎉 You Won!" : "Game Over",
        description: isWinner ? 
          "Congratulations on completing your journey!" : 
          `${updatedSession.game_state.winner === 'player1' ? updatedSession.player1_nickname : updatedSession.player2_nickname} won the game!`,
      });
    }
  };

  const updateGameState = async (newState: Partial<GameState>) => {
    try {
      await sessionManager.updateGameState(sessionId, newState);
    } catch (error) {
      console.error('Error updating game state:', error);
      toast({
        title: "Update Error",
        description: "Failed to sync game state",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
            🎮
          </div>
          <p className="text-gray-600">Loading game session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">Failed to load game session</p>
        </div>
      </div>
    );
  }

  // Pass additional props to GameBoard for multiplayer functionality
  const multiplayerGameData = {
    ...localGameData,
    isMultiplayer: true,
    currentPlayerId: isPlayer2 ? 'player2' : 'player1',
    onGameStateUpdate: updateGameState,
    sessionId
  };

  return (
    <GameBoard 
      gameData={multiplayerGameData} 
      roomCode={sessionId}
    />
  );
};

export default MultiplayerGameBoard;
