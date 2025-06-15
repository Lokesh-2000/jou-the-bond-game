
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
  { id: 'friend', label: 'Friend', emoji: '🤝', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'lover', label: 'Lover', emoji: '❤️', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'crush', label: 'Crush', emoji: '💕', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'stranger', label: 'Stranger', emoji: '🤝', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'complicated', label: 'Complicated', emoji: '🌀', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const conversationStyles = [
  'Friendly', 'Romantic', 'Fun', 'Curious', 'Deep', 'Pleasant'
];

const JoinRoom = ({ onComplete, roomCode }: JoinRoomProps) => {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [relationshipType, setRelationshipType] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const { toast } = useToast();

  // Fetch latest session on mount to pre-populate fields if host already chose setup
  // Alternative: You could run this in useEffect if desired

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1 && nickname.trim()) {
      setStep(2);
    } else if (step === 2 && relationshipType) {
      setStep(3);
    } else if (step === 3 && selectedStyles.length >= 2) {
      setStep(4);
    } else if (step === 4) {
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
          description: "The room code you entered doesn't exist or is already full.",
          variant: "destructive",
        });
        return;
      }
      setSessionData(session);

      // If Player A did not choose relationship yet, let Player B set
      let shouldUpdateSession = false;
      if (
        !session.relationship_type ||
        !session.conversation_styles
      ) {
        shouldUpdateSession = true;
      }
      // Update session with B's setup if needed
      let newSessionData = session;
      if (shouldUpdateSession) {
        newSessionData = await sessionManager.updateSessionSetup(roomCode, {
          relationship_type: relationshipType,
          conversation_styles: selectedStyles,
          custom_question: customQuestion,
        });
      }
      toast({
        title: "Joined Successfully!",
        description: "You've joined the game. Let the journey begin!",
      });

      onComplete({
        sessionId: newSessionData.session_id,
        playerId: newSessionData.player2_id,
        nickname: nickname.trim(),
        relationshipType: newSessionData.relationship_type,
        conversationStyles: newSessionData.conversation_styles,
        customQuestion: newSessionData.custom_question,
        isPlayer2: true
      });
    } catch (error: any) {
      // Show specific error for full or missing rooms
      const errMsg =
        error?.message?.includes("already has two players")
          ? "This room does not exist or already has two players. Please check the code or ask the host for help."
          : error.message || "Failed to join the session. Please try again.";
      toast({
        title: "Join Failed",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return nickname.trim();
    if (step === 2) return relationshipType;
    if (step === 3) return selectedStyles.length >= 2;
    return true;
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

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">Choose Relationship Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relationshipTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={relationshipType === type.id ? "default" : "outline"}
                    onClick={() => setRelationshipType(type.id)}
                    className={`p-6 h-auto flex flex-col items-center space-y-2 ${
                      relationshipType === type.id 
                        ? 'bg-purple-600 text-white' 
                        : 'hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-2xl">{type.emoji}</span>
                    <span className="font-medium">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">
                Choose Conversation Style 
                <span className="text-sm text-gray-500 block">Select at least 2</span>
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {conversationStyles.map((style) => (
                  <Badge
                    key={style}
                    variant={selectedStyles.includes(style) ? "default" : "outline"}
                    onClick={() => handleStyleToggle(style)}
                    className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-purple-100'
                    }`}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
              <div className="text-center text-sm text-gray-600">
                Selected: {selectedStyles.length}/6
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">Ask Them Anything</h3>
              <p className="text-gray-600 text-center">Optional - Add a custom question</p>
              <Input
                placeholder="Do you like me back?"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="text-center"
                maxLength={120}
                disabled={isJoining}
              />
              <div className="text-xs text-gray-500 text-center">
                {customQuestion.length}/120 characters
              </div>
            </div>
          )}

          {step > 0 && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || isJoining}
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isJoining ? 'Joining...' : (step === 4 ? 'Join Game' : 'Next')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JoinRoom;

