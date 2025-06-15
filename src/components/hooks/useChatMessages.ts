
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  session_id: string;
  sender: "player1" | "player2" | "system";
  nickname?: string | null;
  content: string;
  sent_at: string;
}

// Helper to cast sender type
const isSenderType = (v: string): v is ChatMessage["sender"] =>
  v === "player1" || v === "player2" || v === "system";

// Use `sessionId` to scope chat messages to the game
export const useChatMessages = (
  sessionId: string | undefined,
  nickname: string,
  sender: "player1" | "player2"
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  // Fetch all previous messages
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("sent_at", { ascending: true });
    if (data) {
      // Ensure all message 'sender' values are typed correctly
      const typedMessages = data
        .map((msg: any) => {
          if (isSenderType(msg.sender)) {
            return msg as ChatMessage;
          }
          // Fallback: ignore/skip message with invalid 'sender' type
          return null;
        })
        .filter(Boolean) as ChatMessage[];
      setMessages(typedMessages);
    }
    setLoading(false);
  }, [sessionId]);

  // Subscribe to new messages for this session
  useEffect(() => {
    if (!sessionId) return;
    fetchMessages();

    const channel = supabase
      .channel(`chat_messages:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
          if (payload.new && isSenderType(payload.new.sender)) {
            setMessages(prev =>
              prev.some(msg => msg.id === payload.new.id)
                ? prev
                : [...prev, payload.new as ChatMessage]
            );
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchMessages]);

  // Send a chat message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || !content.trim()) return;
      const { error } = await supabase.from("chat_messages").insert([
        {
          session_id: sessionId,
          sender,
          nickname,
          content: content.trim(),
        },
      ]);
      if (error) {
        throw new Error("Failed to send message");
      }
    },
    [sessionId, nickname, sender]
  );

  return {
    messages,
    loading,
    sendMessage,
  };
};
