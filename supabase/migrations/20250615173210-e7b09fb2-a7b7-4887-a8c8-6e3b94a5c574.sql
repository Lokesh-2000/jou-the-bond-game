
-- Create chat_messages table for in-game chat
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('player1', 'player2', 'system')),
  nickname TEXT,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to post/read for now (rls required, but public for MVP)
CREATE POLICY "Allow all chat reads" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow all chat writes" ON public.chat_messages FOR INSERT WITH CHECK (true);

