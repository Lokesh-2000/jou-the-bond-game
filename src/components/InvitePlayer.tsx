
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { sessionManager } from '@/utils/sessionManager';

interface InvitePlayerProps {
  onComplete: (roomCode: string) => void;
  gameData: any;
}

const InvitePlayer = ({ onComplete, gameData }: InvitePlayerProps) => {
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate invite link when room code is available
    if (roomCode) {
      const link = `${window.location.origin}?room=${roomCode}`;
      setInviteLink(link);
    }
  }, [roomCode]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my JOU game!',
          text: 'Let\'s play JOU together - a journey of meaningful conversation',
          url: inviteLink,
        });
      } catch (err) {
        copyToClipboard(inviteLink, 'Invite link');
      }
    } else {
      copyToClipboard(inviteLink, 'Invite link');
    }
  };

  const handleStartGame = async () => {
    if (!nickname.trim()) return;

    setIsCreating(true);
    try {
      const sessionId = await sessionManager.createSession(gameData, nickname.trim());
      setRoomCode(sessionId);
      
      toast({
        title: "Session Created!",
        description: "Share the room code with your partner to start playing",
      });
      
      // Start listening for when player 2 joins
      sessionManager.subscribeToSession(sessionId, (session) => {
        if (session.game_state.game_started && session.player2_id) {
          // Both players are ready, start the game
          onComplete(sessionId);
        }
      });
      
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create game session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Invite Player</h2>
            <p className="text-gray-600">Share your room to start the journey</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Nickname
              </label>
              <Input
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                disabled={!!roomCode}
              />
            </div>

            {roomCode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      value={roomCode} 
                      readOnly 
                      className="font-mono text-lg text-center bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(roomCode, 'Room code')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      value={inviteLink} 
                      readOnly 
                      className="text-sm bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={shareInvite}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800 text-center">
                    🎮 Waiting for your partner to join...
                  </p>
                </div>
              </>
            )}

            {!roomCode && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800 text-center">
                  💡 Share the room code or link with your partner to start the game
                </p>
              </div>
            )}
          </div>

          {!roomCode ? (
            <Button 
              onClick={handleStartGame}
              disabled={!nickname.trim() || isCreating}
              className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating Session...' : 'Create Room'}
            </Button>
          ) : (
            <div className="text-center text-sm text-gray-600">
              Game will start automatically when your partner joins
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvitePlayer;
