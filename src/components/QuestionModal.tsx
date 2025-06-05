
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QuestionModalProps {
  showQuestion: boolean;
  currentQuestion: string;
  answer: string;
  setAnswer: (answer: string) => void;
  onSubmit: () => void;
  onMirror: () => void;
  onSkip: () => void;
  canMirror: boolean;
  canSkip: boolean;
  onClose: () => void;
}

const QuestionModal = ({
  showQuestion,
  currentQuestion,
  answer,
  setAnswer,
  onSubmit,
  onMirror,
  onSkip,
  canMirror,
  canSkip,
  onClose
}: QuestionModalProps) => {
  return (
    <Dialog open={showQuestion} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Question Time! 🐍
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border-l-4 border-red-400">
            <p className="text-lg font-medium text-gray-800">{currentQuestion}</p>
          </div>
          
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={120}
              rows={4}
              className="resize-none border-2 border-gray-200 focus:border-red-400 rounded-xl text-base"
            />
            <div className="text-xs text-gray-500 text-right">
              {answer.length}/120 characters
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onSubmit}
              disabled={!answer.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Submit Answer
            </Button>
            
            <div className="flex gap-2">
              {canMirror && (
                <Button 
                  variant="outline" 
                  onClick={onMirror}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                  title="Mirror question back"
                >
                  🔁
                </Button>
              )}
              
              {canSkip && (
                <Button 
                  variant="outline" 
                  onClick={onSkip}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200"
                  title="Skip this question"
                >
                  ⏭️
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
