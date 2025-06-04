
interface QuestionBank {
  [key: string]: {
    funLively: string[];
    curiosity: string[];
    thematic: string[];
    surprise: string[];
  };
}

const questionBank: QuestionBank = {
  friend: {
    funLively: [
      "What's the most embarrassing thing you've done in public?",
      "What's the funniest nickname you've ever had?",
      "What's the weirdest food combination you've ever tried?",
      "What's the weirdest thing you've ever eaten?",
      "If you have to propose to someone, how would you do it?"
    ],
    curiosity: [
      "What's a secret talent you have?",
      "What's a hobby you've always wanted to try?",
      "What's your favorite movie of all time?",
      "What's your favorite color?"
    ],
    thematic: [
      "What's your favorite memory of us together?",
      "What's something you've always wanted to do with me but haven't?",
      "Tell me a gossip that you never told me."
    ],
    surprise: [
      "If we need to explain our relationship with a movie name, what would it be?",
      "If you were to hit me with anything, what would it be?"
    ]
  },
  crush: {
    funLively: [
      "What's your most frequently played song?",
      "If we could travel anywhere together, where would we go?",
      "What's your idea of a perfect date night?",
      "What's your favorite thing to do with me and why?"
    ],
    curiosity: [
      "If you could ask me anything, what would it be?",
      "What's one thing you've always wanted to try but haven't?",
      "What are the three songs you would listen to for the next 5 years?",
      "What's your favorite movie?"
    ],
    thematic: [
      "Do you believe in love at first sight?",
      "If I would say yes to one thing, what would you ask me?",
      "What's the thing that makes you remember me?",
      "What do you expect from your partner?"
    ],
    surprise: [
      "Describe our relationship with a movie name.",
      "If you have to dedicate a song to me, what would it be?"
    ]
  },
  lover: {
    funLively: [
      "What's the funniest thing that's happened to us together?",
      "What's a silly habit of mine that you secretly love?",
      "What's your favorite thing I do for you?",
      "How's your day?"
    ],
    curiosity: [
      "What's a dream you've never shared?",
      "If we could take a class together, what would it be?",
      "What's something new you'd like us to try?"
    ],
    thematic: [
      "Where do you see us in five years?",
      "What scares you the most about our relationship?",
      "What's your idea of a dream home – only you and me?",
      "What do you think we need to do to improve our relationship?",
      "What are the things that make you angry about me?",
      "What's a song that perfectly describes our relationship?"
    ],
    surprise: [
      "If you had to kiss me only in one place for the rest of your life, where would that be?",
      "Describe our love using only emojis"
    ]
  },
  stranger: {
    funLively: [
      "What's your go-to comfort food?",
      "What's a fun fact about yourself that few people know?",
      "If you could have any superpower, what would it be?",
      "How's your day?"
    ],
    curiosity: [
      "If you could live in any era, which would it be and why?",
      "What's your dream job?",
      "What's a book or movie that changed your perspective?",
      "What's your favorite color?"
    ],
    thematic: [
      "What made you accept this invite?",
      "First impressions of me?",
      "What's a guilty pleasure you're into?",
      "Would you swipe right on me?",
      "What's a place you've always wanted to visit?",
      "What are three songs you'd never get bored of?"
    ],
    surprise: [
      "If you had to kiss someone to avoid dying, where would you kiss them?",
      "If you could ask me one weird question and I had to answer honestly, what would it be?"
    ]
  },
  complicated: {
    funLively: [
      "If our relationship were a movie genre, what would it be?",
      "What's a funny memory we share?",
      "What's a song that captures our dynamic?"
    ],
    curiosity: [
      "How do you think we could improve our communication?",
      "If you had to pick one word to describe us, what would it be?",
      "What do you expect from your partner?"
    ],
    thematic: [
      "What do we need to fix between us?",
      "Is there something unsaid that you wish I knew?",
      "When did things start changing?",
      "What would you change about how we talk?",
      "What scares you the most about our situation?",
      "What do you hope for us moving forward?",
      "What's something you've been hesitant to tell me?",
      "What do you think we need to do to improve our relationship?",
      "What are the things that make you angry about me?"
    ],
    surprise: [
      "If I said yes to one thing, what would you ask?",
      "Rate our vibe from 1 to 10",
      "Describe our relationship with a movie name"
    ]
  }
};

export const getQuestionForRelationship = (relationshipType: string, conversationStyles: string[]): string => {
  const questions = questionBank[relationshipType] || questionBank.stranger;
  
  // Combine all question types based on conversation styles
  let availableQuestions: string[] = [];
  
  if (conversationStyles.includes('Fun')) {
    availableQuestions = [...availableQuestions, ...questions.funLively];
  }
  if (conversationStyles.includes('Curious')) {
    availableQuestions = [...availableQuestions, ...questions.curiosity];
  }
  if (conversationStyles.includes('Deep') || conversationStyles.includes('Romantic')) {
    availableQuestions = [...availableQuestions, ...questions.thematic];
  }
  
  // Always include some surprise questions
  availableQuestions = [...availableQuestions, ...questions.surprise];
  
  // Remove duplicates and return random question
  const uniqueQuestions = [...new Set(availableQuestions)];
  return uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
};
