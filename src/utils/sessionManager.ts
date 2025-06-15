import { createClient } from '@supabase/supabase-js';

// Define types for the data we'll be storing in the session
export interface Session {
  session_id: string;
  player1_id: string;
  player2_id: string | null;
  player1_nickname: string | null;
  player2_nickname: string | null;
  relationship_type: string | null;
  conversation_styles: string[] | null;
  custom_question: string | null;
  game_state: any | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate a unique session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Session management functions
export const sessionManager = {
  async createSession(player1Nickname: string, setupData: any): Promise<Session> {
    const sessionId = generateSessionId();
    const player1Id = Math.random().toString(36).substring(2, 15);

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          session_id: sessionId,
          player1_id: player1Id,
          player1_nickname: player1Nickname,
          relationship_type: setupData.relationshipType,
          conversation_styles: setupData.conversationStyles,
          custom_question: setupData.customQuestion,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      throw error;
    }

    return data;
  },

  async joinSession(sessionId: string, player2Nickname: string): Promise<Session | null> {
    const player2Id = Math.random().toString(36).substring(2, 15);

    const { data, error } = await supabase
      .from('sessions')
      .update({ player2_id: player2Id, player2_nickname: player2Nickname })
      .eq('session_id', sessionId)
      .eq('player2_id', null) // Ensure only one player joins
      .select()
      .single();

    if (error) {
      console.error("Error joining session:", error);
      throw error;
    }

    return data;
  },

  async getSession(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error("Error fetching session:", error);
      return null;
    }

    return data;
  },

  async updateGameState(sessionId: string, gameState: any): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .update({ game_state: gameState })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      console.error("Error updating game state:", error);
      throw error;
    }

    return data;
  },

  // Add a real-time listener for session updates
  subscribeToSession(sessionId: string, callback: (session: Session) => void) {
    supabase
      .channel('any')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          console.log('Change received!', payload)
          // Pass the updated session data to the callback
          callback(payload.new as Session);
        }
      )
      .subscribe()
  },

  // Unsubscribe from session updates
  unsubscribeFromSession() {
    supabase.removeAllChannels();
  },
  async updateSessionSetup(sessionId: string, setup: {
    relationship_type: string;
    conversation_styles: string[];
    custom_question?: string;
  }) {
    // PATCH the session with new setup by session_id (string), not uuid
    const { data, error } = await supabase
      .from('sessions')
      .update({
        relationship_type: setup.relationship_type,
        conversation_styles: setup.conversation_styles,
        custom_question: setup.custom_question
      })
      .eq('session_id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
