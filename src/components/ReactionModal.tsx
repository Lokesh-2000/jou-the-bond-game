
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReactionModalProps {
  showReactions: boolean;
  lastAnswer: string;
  onReaction: (emoji: string) => void;
  onClose: () => void;
}

const ReactionModal = ({ showReactions, lastAnswer, onReaction, onClose }: ReactionModalProps) => {
  const reactions = [
    { emoji: '🙃', label: 'Silly' },
    { emoji: '😒', label: 'Meh' },
    { emoji: '😌', label: 'Nice' },
    { emoji: '👌', label: 'Perfect' },
    { emoji: '💘', label: 'Love it' }
  ];

  return (
    <Dialog open={showReactions} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-white to-purple-50 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            How do you feel about their answer?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-400">
            <p className="italic text-gray-700 text-lg">"{lastAnswer}"</p>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {reactions.map((reaction) => (
              <Button
                key={reaction.emoji}
                variant="outline"
                onClick={() => onReaction(reaction.emoji)}
                className="aspect-square p-0 text-3xl rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transform transition-all duration-200 hover:scale-110 group"
                title={reaction.label}
              >
                <span className="group-hover:animate-bounce">{reaction.emoji}</span>
              </Button>
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-500">
            Tap an emoji to react to their answer
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReactionModal;
