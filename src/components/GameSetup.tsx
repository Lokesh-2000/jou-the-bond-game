
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface GameSetupProps {
  onComplete: (data: any) => void;
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

const GameSetup = ({ onComplete }: GameSetupProps) => {
  const [step, setStep] = useState(1);
  const [relationshipType, setRelationshipType] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleNext = () => {
    if (step === 1 && relationshipType) {
      setStep(2);
    } else if (step === 2 && selectedStyles.length >= 2) {
      setStep(3);
    } else if (step === 3) {
      onComplete({
        relationshipType,
        conversationStyles: selectedStyles,
        customQuestion
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return relationshipType;
    if (step === 2) return selectedStyles.length >= 2;
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <div className="space-y-6">
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
              <div className="text-center text-sm text-gray-600">
                Selected: {selectedStyles.length}/6
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
              <div className="text-xs text-gray-500 text-center">
                {customQuestion.length}/120 characters
              </div>
            </div>
          )}

          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Next → Invite Player' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameSetup;
