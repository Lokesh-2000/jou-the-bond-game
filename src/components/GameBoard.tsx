
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getQuestionForRelationship } from '@/utils/questionSystem';
import { getThemeColors } from '@/utils/gameThemes';
import SnakeOverlay from '@/components/SnakeOverlay';

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
  
  // Snakes and Ladders positions
  const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
  };
  
  const ladders = {
    1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
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
        <div 
          key={i} 
          className={`
            relative w-12 h-12 border border-gray-300 flex items-center justify-center text-xs font-bold
            ${themeColors.board}
            ${hasSnake ? 'bg-red-100/50' : ''}
            ${hasLadder ? 'bg-green-100/50' : ''}
          `}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1
          }}
        >
          {i}
          {hasLadder && <span className="absolute top-0 right-0 text-xs z-10">🪜</span>}
          {hasPlayer1 && (
            <div className={`absolute -top-1 -left-1 w-4 h-4 rounded-full ${themeColors.player1} flex items-center justify-center text-white text-xs z-20`}>
              1
            </div>
          )}
          {hasPlayer2 && (
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${themeColors.player2} flex items-center justify-center text-white text-xs z-20`}>
              2
            </div>
          )}
        </div>
      );
    }
    return tiles;
  };

  return (
    <div className={`min-h-screen p-4 ${themeColors.background}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">JOU Game</h1>
              <p className="text-gray-600">Room: {roomCode}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Current Turn</p>
              <Badge className={currentPlayer === 1 ? themeColors.player1 : themeColors.player2}>
                Player {currentPlayer}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <Card className="lg:col-span-3 p-6 bg-white/90 backdrop-blur-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center">Game Board</h2>
              <div 
                className="relative grid grid-cols-10 gap-1 mx-auto"
                style={{ width: 'fit-content' }}
              >
                {renderBoard()}
                <SnakeOverlay relationshipType={gameData.relationshipType} />
              </div>
            </div>
          </Card>

          {/* Game Controls */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm space-y-4">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-lg ${themeColors.dice} flex items-center justify-center text-2xl font-bold text-white mb-4`}>
                {diceValue}
              </div>
              <Button 
                onClick={rollDice}
                disabled={isRolling}
                className={`w-full ${themeColors.button}`}
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Player Positions</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Player 1:</span>
                  <span>{playerPositions.player1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Player 2:</span>
                  <span>{playerPositions.player2}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              <p>🐍 = Question</p>
              <p>🪜 = Ladder up</p>
              <p>Roll 6 to start & get extra turn</p>
            </div>
          </Card>
        </div>

        {/* Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={setShowQuestion}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Question Time! 🐍</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-lg">{currentQuestion}</p>
              <Textarea
                placeholder="Your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={120}
                rows={3}
              />
              <div className="text-xs text-gray-500">
                {answer.length}/120 characters
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnswerSubmit}
                  disabled={!answer.trim()}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
                {!mirrorUsed[`player${currentPlayer}` as keyof typeof mirrorUsed] && (
                  <Button 
                    variant="outline" 
                    onClick={handleMirrorQuestion}
                    className="text-xs"
                  >
                    🔁 Mirror
                  </Button>
                )}
                {canSkip && (
                  <Button 
                    variant="outline" 
                    onClick={handleSkipQuestion}
                    className="text-xs"
                  >
                    🛑 Skip
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reaction Dialog */}
        <Dialog open={showReactions} onOpenChange={setShowReactions}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>React to their answer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="italic">"{lastAnswer}"</p>
              </div>
              <div className="flex justify-center gap-4">
                {['🙃', '😒', '😌', '👌', '💘'].map((emoji) => (
                  <Button
                    key={emoji}
                    variant="outline"
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl w-12 h-12 p-0"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GameBoard;
