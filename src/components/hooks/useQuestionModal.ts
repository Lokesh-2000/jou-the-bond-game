
import { useState, useCallback } from "react";

export function useQuestionModal(setGameState: (updater: any) => void, isMultiplayer: boolean, gameData: any, gameState: any) {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [questionAnswerSync, setQuestionAnswerSync] = useState<{question: string|null, answer: string|null}>({question: null, answer: null});

  const showQuestion = !!currentQuestion || !!questionAnswerSync.question;

  const handleShowQuestion = useCallback((pickedQuestion: string, pos: number) => {
    setCurrentQuestion(pickedQuestion);
    setQuestionAnswerSync({ question: pickedQuestion, answer: null });
    setGameState((gs: any) => ({
      ...gs,
      questionsTriggered: [...gs.questionsTriggered, pos],
      lastQuestionAsked: pickedQuestion,
      lastQuestionAnswer: null,
    }));
    if (isMultiplayer && gameData.onGameStateUpdate) {
      gameData.onGameStateUpdate({
        ...gameState,
        questionsTriggered: [...gameState.questionsTriggered, pos],
        lastQuestionAsked: pickedQuestion,
        lastQuestionAnswer: null,
      });
    }
  }, [setGameState, isMultiplayer, gameData, gameState]);

  const handleAnswer = (answer?: string) => {
    setCurrentQuestion(null);
    setQuestionAnswerSync(prev => ({
      ...prev,
      answer: answer || ""
    }));
    setGameState((gs: any) => ({
      ...gs,
      lastQuestionAnswer: answer || ""
    }));
    if (isMultiplayer && gameData.onGameStateUpdate) {
      gameData.onGameStateUpdate({
        ...gameState,
        lastQuestionAnswer: answer || ""
      });
    }
  };

  // For external sync
  const syncFromGameState = useCallback((newGS: any) => {
    if (newGS.lastQuestionAsked || newGS.lastQuestionAnswer) {
      setQuestionAnswerSync({
        question: newGS.lastQuestionAsked || null,
        answer: newGS.lastQuestionAnswer || null
      });
    }
  }, []);

  return {
    showQuestion,
    currentQuestion,
    setCurrentQuestion,
    questionAnswerSync,
    setQuestionAnswerSync,
    handleShowQuestion,
    handleAnswer,
    syncFromGameState,
  };
}
