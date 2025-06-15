
import { useEffect, useRef, useState } from "react";
import { useChatMessages } from "./hooks/useChatMessages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ChatProps {
  sessionId: string;
  nickname: string;
  sender: "player1" | "player2";
}

const Chat = ({ sessionId, nickname, sender }: ChatProps) => {
  const { messages, loading, sendMessage } = useChatMessages(sessionId, nickname, sender);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await sendMessage(input);
      setInput("");
    } catch (err) {
      // Optionally show toast
    }
    setSending(false);
  };

  return (
    <Card className="mt-6 shadow-none border-0 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center gap-2 px-4 pt-4 pb-1">
        <MessageSquare className="text-purple-400" />
        <span className="font-semibold text-gray-700">In-game chat</span>
      </div>
      <div
        ref={scrollRef}
        className="h-60 max-h-72 overflow-y-auto px-4 py-2 flex flex-col gap-2 border-b border-b-gray-200"
        style={{ background: "white", borderRadius: "0 0 1rem 1rem" }}
      >
        {loading ? (
          <div className="text-gray-400 text-center py-4">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No messages yet. Say hi 👋</div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`
                flex flex-col
                ${msg.sender === sender
                  ? "items-end"
                  : "items-start"}
              `}
            >
              <div className={`rounded-xl px-3 py-2 text-sm max-w-xs
                ${msg.sender === sender
                  ? "bg-purple-100 text-purple-800"
                  : msg.sender === "system"
                    ? "bg-gray-200 text-gray-500 italic"
                    : "bg-pink-100 text-pink-700"}`}>
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 select-none mt-1">
                {msg.nickname || (msg.sender === "player1" ? "Player 1" : msg.sender === "player2" ? "Player 2" : "System")}
                {" • "}
                {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 px-4 py-3 bg-white rounded-b-xl">
        <input
          type="text"
          value={input}
          autoComplete="off"
          onChange={e => setInput(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-purple-400"
          placeholder="Type your message…"
          maxLength={180}
          disabled={sending || loading}
        />
        <Button
          type="submit"
          size="sm"
          className="px-4"
          disabled={sending || !input.trim() || loading}
        >
          Send
        </Button>
      </form>
    </Card>
  );
};

export default Chat;
