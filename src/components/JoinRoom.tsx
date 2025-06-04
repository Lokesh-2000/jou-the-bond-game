
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [relationshipType, setRelationshipType] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [nickname, setNickname] = useState('');

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
    } else if (step === 1 && relationshipType) {
      setStep(2);
    } else if (step === 2 && selectedStyles.length >= 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      onComplete({
        relationshipType,
        conversationStyles: selectedStyles,
        customQuestion,
        nickname,
        roomCode
      });
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return relationshipType;
    if (step === 2) return selectedStyles.length >= 2;
    if (step === 3) return true;
    if (step === 4) return nickname.trim();
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
              <Button 
                onClick={handleNext}
                className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Join the Room
              </Button>
            </div>
          )}

          {step >= 1 && step <= 3 && (
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3].map((num) => (
                  <div 
                    key={num}
                    className={`w-3 h-3 rounded-full ${
                      num <= step ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Game Setup</h2>
            </div>
          )}

          {step === 1 && (
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

          {step === 2 && (
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
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">Ask Them Anything</h3>
              <p className="text-gray-600 text-center">Optional - Add a custom question</p>
              <Input
                placeholder="Do you like me back?"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="text-center"
                maxLength={120}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Room</h2>
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
                  />
                </div>
              </div>
            </div>
          )}

          {step > 0 && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {step === 4 ? 'Start Game' : 'Next'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JoinRoom;
