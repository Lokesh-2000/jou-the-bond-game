
import QuestionModal from "./QuestionModal";
import ReactionModal from "./ReactionModal";

interface GameBoardModalsProps {
  showQuestion: boolean;
  currentQuestion: string;
  answer: string;
  setAnswer: (answer: string) => void;
  onSubmit: (answer?: string) => void;
  onMirror: () => void;
  onSkip: () => void;
  canMirror: boolean;
  canSkip: boolean;
  onCloseQuestion: () => void;
  showReaction: boolean;
  reactionType: string;
  lastAnswer: string;
  onReaction: (emoji: string) => void;
  onCloseReaction: () => void;
}

const GameBoardModals = ({
  showQuestion,
  currentQuestion,
  answer,
  setAnswer,
  onSubmit,
  onMirror,
  onSkip,
  canMirror,
  canSkip,
  onCloseQuestion,
  showReaction,
  reactionType,
  lastAnswer,
  onReaction,
  onCloseReaction
}: GameBoardModalsProps) => (
  <>
    {showQuestion && (
      <QuestionModal
        showQuestion={showQuestion}
        currentQuestion={currentQuestion}
        answer={answer}
        setAnswer={setAnswer}
        onSubmit={onSubmit}
        onMirror={onMirror}
        onSkip={onSkip}
        canMirror={canMirror}
        canSkip={canSkip}
        onClose={onCloseQuestion}
      />
    )}
    {showReaction && (
      <ReactionModal
        showReactions={showReaction}
        lastAnswer={lastAnswer}
        onReaction={onReaction}
        onClose={onCloseReaction}
      />
    )}
  </>
);

export default GameBoardModals;
