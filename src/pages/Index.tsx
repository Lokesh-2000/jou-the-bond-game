
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameSetup from '@/components/GameSetup';
import InvitePlayer from '@/components/InvitePlayer';
import GameBoard from '@/components/GameBoard';
import JoinRoom from '@/components/JoinRoom';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'setup' | 'invite' | 'join' | 'board'>('welcome');
  const [gameData, setGameData] = useState<any>({});
  const [roomCode, setRoomCode] = useState<string>('');

  const handleSetupComplete = (setupData: any) => {
    setGameData(setupData);
    setCurrentScreen('invite');
  };

  const handleInviteComplete = (code: string) => {
    setRoomCode(code);
    setCurrentScreen('board');
  };

  const handleJoinComplete = (joinData: any) => {
    setGameData({ ...gameData, ...joinData });
    setCurrentScreen('board');
  };

  // Check if URL has room code for joining
  const urlParams = new URLSearchParams(window.location.search);
  const joinCode = urlParams.get('room');
  
  if (joinCode && currentScreen === 'welcome') {
    setCurrentScreen('join');
    setRoomCode(joinCode);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {currentScreen === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  JOU
                </h1>
                <p className="text-gray-600 text-lg italic">
                  Not just a game. A journey 💫
                </p>
              </div>
              
              <div className="py-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl">
                  🎮
                </div>
              </div>

              <Button 
                onClick={() => setCurrentScreen('setup')}
                className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                Start JOU
              </Button>
            </div>
          </Card>
        </div>
      )}

      {currentScreen === 'setup' && (
        <GameSetup onComplete={handleSetupComplete} />
      )}

      {currentScreen === 'invite' && (
        <InvitePlayer onComplete={handleInviteComplete} gameData={gameData} />
      )}

      {currentScreen === 'join' && (
        <JoinRoom onComplete={handleJoinComplete} roomCode={roomCode} />
      )}

      {currentScreen === 'board' && (
        <GameBoard gameData={gameData} roomCode={roomCode} />
      )}
    </div>
  );
};

export default Index;
