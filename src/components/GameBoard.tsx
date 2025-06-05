import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { getQuestionForRelationship } from '@/utils/questionSystem';
import { getThemeColors } from '@/utils/gameThemes';
import SnakeOverlay from '@/components/SnakeOverlay';
import LadderOverlay from '@/components/LadderOverlay';
import BoardTile from '@/components/BoardTile';
import DiceController from '@/components/DiceController';
import GameStatus from '@/components/GameStatus';
import QuestionModal from '@/components/QuestionModal';
import ReactionModal from '@/components/ReactionModal';

interface GameBoardProps {
  gameData: any;
  roomCode: string;
}

const GameBoard = ({ gameData, roomCode }: GameBoardProps) => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerPositions, setPlayerPositions] = useState({ player1: 0, player2: 0 });
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [lastAnswer, setLastAnswer] = useState('');
  const [consecutiveSnakes, setConsecutiveSnakes] = useState(0);
  const [mirrorUsed, setMirrorUsed] = useState({ player1: false, player2: false });
  const [canSkip, setCanSkip] = useState(false);

  const themeColors = getThemeColors(gameData.relationshipType);
  
  // Updated snakes and ladders positions for emotional narrative
  const snakes = {
    38: 15,
    47: 19,
    53: 35,
    62: 55,
    86: 54,
    92: 70,
    94: 6,
    97: 78,
    82: 65,
    29: 8
  };
  
  const ladders = {
    5: 58,
    9: 27,
    33: 87,
    40: 64,
    57: 73,
    63: 81,
    75: 93
  };

  const rollDice = async () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Animate dice roll
    for (let i = 0; i < 10; i++) {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const finalValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalValue);
    
    // Check if player can start (needs 6 to start)
    const currentPos = playerPositions[`player${currentPlayer}` as keyof typeof playerPositions];
    
    if (currentPos === 0 && finalValue !== 6) {
      setIsRolling(false);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      return;
    }
    
    // Move player
    const newPos = Math.min(currentPos + finalValue, 100);
    setPlayerPositions(prev => ({
      ...prev,
      [`player${currentPlayer}`]: newPos
    }));
    
    // Check for snakes and ladders
    setTimeout(() => {
      handleSpecialTiles(newPos, finalValue);
    }, 500);
  };

  const handleSpecialTiles = (position: number, diceRoll: number) => {
    if (snakes[position as keyof typeof snakes]) {
      // Snake - ask question
      const newPos = snakes[position as keyof typeof snakes];
      setPlayerPositions(prev => ({
        ...prev,
        [`player${currentPlayer}`]: newPos
      }));
      
      setConsecutiveSnakes(prev => prev + 1);
      setCanSkip(consecutiveSnakes >= 1);
      
      const question = getQuestionForRelationship(gameData.relationshipType, gameData.conversationStyles);
      setCurrentQuestion(question);
      setShowQuestion(true);
    } else if (ladders[position as keyof typeof ladders]) {
      // Ladder - move up
      const newPos = ladders[position as keyof typeof ladders];
      setPlayerPositions(prev => ({
        ...prev,
        [`player${currentPlayer}`]: newPos
      }));
      setConsecutiveSnakes(0);
      
      // Check for win
      if (newPos === 100) {
        handleGameEnd();
        return;
      }
      
      // Extra turn if rolled 6
      if (diceRoll !== 6) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    } else {
      setConsecutiveSnakes(0);
      
      // Check for win
      if (position === 100) {
        handleGameEnd();
        return;
      }
      
      // Extra turn if rolled 6
      if (diceRoll !== 6) {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
    
    setIsRolling(false);
  };

  const handleAnswerSubmit = () => {
    if (answer.trim()) {
      setLastAnswer(answer);
      setShowQuestion(false);
      setShowReactions(true);
      setAnswer('');
      
      // Next player's turn after reaction
      setTimeout(() => {
        setShowReactions(false);
        if (diceValue !== 6) {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
      }, 3000);
    }
  };

  const handleReaction = (emoji: string) => {
    console.log(`Player reacted with: ${emoji}`);
    setShowReactions(false);
    
    if (diceValue !== 6) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const handleMirrorQuestion = () => {
    setMirrorUsed(prev => ({
      ...prev,
      [`player${currentPlayer}`]: true
    }));
    // Mirror the question back to the other player
    console.log('Question mirrored');
  };

  const handleSkipQuestion = () => {
    setShowQuestion(false);
    setConsecutiveSnakes(0);
    setCanSkip(false);
    
    if (diceValue !== 6) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const handleGameEnd = () => {
    console.log('Game ended!');
    // TODO: Show game archive screen
  };

  const renderBoard = () => {
    const tiles = [];
    for (let i = 100; i >= 1; i--) {
      const row = Math.floor((100 - i) / 10);
      const isEvenRow = row % 2 === 0;
      const col = isEvenRow ? (100 - i) % 10 : 9 - ((100 - i) % 10);
      
      const hasPlayer1 = playerPositions.player1 === i;
      const hasPlayer2 = playerPositions.player2 === i;
      const hasSnake = snakes[i as keyof typeof snakes];
      const hasLadder = ladders[i as keyof typeof ladders];
      
      tiles.push(
        <BoardTile
          key={i}
          tileNumber={i}
          hasPlayer1={hasPlayer1}
          hasPlayer2={hasPlayer2}
          hasSnake={!!hasSnake}
          hasLadder={!!hasLadder}
          themeColors={themeColors}
          row={row}
          col={col}
        />
      );
    }
    return tiles;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Romantic Game Header */}
        <Card className="p-6 bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl border border-pink-100/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                JOU Game ✨
              </h1>
              <p className="text-gray-600 mt-1">Emotional Journey • Room: <span className="font-mono font-semibold text-pink-600">{roomCode}</span></p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Romantic Game Board */}
          <Card className="xl:col-span-3 p-8 bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl border border-pink-100/50">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                Couples' Emotional Journey Board
              </h2>
              <div 
                className="relative grid grid-cols-10 gap-1 mx-auto p-6 bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-blue-50/80 rounded-3xl shadow-inner border-2 border-pink-100/30"
                style={{ 
                  width: 'fit-content',
                  aspectRatio: '1/1'
                }}
              >
                {renderBoard()}
                <SnakeOverlay relationshipType={gameData.relationshipType} />
                <LadderOverlay relationshipType={gameData.relationshipType} />
              </div>
            </div>
          </Card>

          {/* Romantic Game Controls */}
          <Card className="p-6 bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl border border-pink-100/50">
            <div className="space-y-6">
              <DiceController
                diceValue={diceValue}
                isRolling={isRolling}
                onRollDice={rollDice}
                themeColors={themeColors}
              />
              
              <GameStatus
                currentPlayer={currentPlayer}
                playerPositions={playerPositions}
                roomCode={roomCode}
                themeColors={themeColors}
              />
            </div>
          </Card>
        </div>

        {/* Question Modal */}
        <QuestionModal
          showQuestion={showQuestion}
          currentQuestion={currentQuestion}
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={handleAnswerSubmit}
          onMirror={handleMirrorQuestion}
          onSkip={handleSkipQuestion}
          canMirror={!mirrorUsed[`player${currentPlayer}` as keyof typeof mirrorUsed]}
          canSkip={canSkip}
          onClose={() => setShowQuestion(false)}
        />

        {/* Reaction Modal */}
        <ReactionModal
          showReactions={showReactions}
          lastAnswer={lastAnswer}
          onReaction={handleReaction}
          onClose={() => setShowReactions(false)}
        />
      </div>
    </div>
  );
};

export default GameBoard;
