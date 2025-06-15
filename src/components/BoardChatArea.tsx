
import Chat from './Chat';

interface BoardChatAreaProps {
  gameData: any;
  roomCode?: string;
}

const BoardChatArea = ({ gameData, roomCode }: BoardChatAreaProps) => {
  if (!gameData.sessionId && !roomCode) return null;
  return (
    <Chat
      sessionId={gameData.sessionId || roomCode}
      nickname={
        gameData.nickname ||
        gameData.player1Nickname ||
        gameData.player2Nickname ||
        "Player"
      }
      sender={gameData.currentPlayerId || "player1"}
    />
  );
};

export default BoardChatArea;
