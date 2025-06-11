
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { sessionManager, Session } from '@/utils/sessionManager';

interface JoinRoomProps {
  onComplete: (data: any) => void;
  roomCode: string;
}

const relationshipTypes = [
  { id: 'friend', label: 'Friend', emoji: '🤝' },
  { id: 'lover', label: 'Lover', emoji: '❤️' },
  { id: 'crush', label: 'Crush', emoji: '💕' },
  { id: 'stranger', label: 'Stranger', emoji: '🤝' },
  { id: 'complicated', label: 'Complicated', emoji: '🌀' },
];

const conversationStyles = [
  'Friendly', 'Romantic', 'Fun', 'Curious', 'Deep', 'Pleasant'
];

const JoinRoom = ({ onComplete, roomCode }: JoinRoomProps) => {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1 && nickname.trim()) {
      handleJoinSession();
    }
  };

  const handleJoinSession = async () => {
    if (!nickname.trim()) return;

    setIsJoining(true);
    try {
      // Try to join the session
      const session = await sessionManager.joinSession(roomCode, nickname.trim());
      
      if (!session) {
        toast({
          title: "Room Not Found",
          description: "The room code you entered doesn't exist.",
          variant: "destructive",
        });
        return;
      }

      setSessionData(session);
      
      toast({
        title: "Joined Successfully!",
        description: "You've joined the game. Let the journey begin!",
      });

      // Complete the join process
      onComplete({
        sessionId: session.session_id,
        playerId: session.player2_id,
        nickname: nickname.trim(),
        relationshipType: session.relationship_type,
        conversationStyles: session.conversation_styles,
        customQuestion: session.custom_question,
        isPlayer2: true
      });
      
    } catch (error: any) {
      console.error('Error joining session:', error);
      toast({
        title: "Join Failed",
        description: error.message || "Failed to join the session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return nickname.trim();
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <div className="space-y-6">
          {step === 0 && (
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                JOU
              </h1>
              <p className="text-gray-600 text-lg italic">
                Not just a game. A journey 💫
              </p>
              <div className="py-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                  🎮
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Room Code:</strong> {roomCode}
                </p>
              </div>
              
              <Button 
                onClick={handleNext}
                className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Join the Room
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Join Game Session</h2>
              <p className="text-gray-600 italic">You're about to begin a meaningful journey.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Nickname
                  </label>
                  <Input
                    placeholder="Enter your nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                    className="text-center"
                    disabled={isJoining}
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    🎯 Ready to join room <strong>{roomCode}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {step > 0 && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || isJoining}
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JoinRoom;
