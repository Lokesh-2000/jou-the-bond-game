
export const useQuestions = () => {
  // This could be enhanced: by theme, difficulty, relationship, etc.
  const getQuestions = () => [
    "What's your favorite memory together?",
    "What's one thing you appreciate about each other?",
    "If you could travel anywhere together, where would it be?",
    "What's a goal you'd like to achieve together?",
    "What's something new you'd like to try together?",
  ];

  const getRandomQuestion = () => {
    const questions = getQuestions();
    return questions[Math.floor(Math.random() * questions.length)];
  };

  return { getQuestions, getRandomQuestion };
};
