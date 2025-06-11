
-- Create the sessions table for multiplayer game sessions
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  player1_id TEXT NOT NULL,
  player1_nickname TEXT,
  player2_id TEXT,
  player2_nickname TEXT,
  game_state JSONB NOT NULL DEFAULT '{
    "player1_position": 0,
    "player2_position": 0,
    "current_turn": "player1",
    "last_dice_roll": 1,
    "questions_triggered": [],
    "game_started": false,
    "game_ended": false,
    "winner": null
  }'::jsonb,
  relationship_type TEXT,
  conversation_styles JSONB,
  custom_question TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions (allow all users to read and create sessions for simplicity)
CREATE POLICY "Anyone can view sessions" 
  ON public.sessions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create sessions" 
  ON public.sessions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update sessions" 
  ON public.sessions 
  FOR UPDATE 
  USING (true);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON public.sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for the sessions table
ALTER TABLE public.sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
