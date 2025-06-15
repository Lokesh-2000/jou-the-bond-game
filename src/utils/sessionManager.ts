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

// Use hardcoded Supabase credentials as required by Lovable
const supabaseUrl = "https://kqpuxmlvjrbiuhkniwvd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcHV4bWx2anJiaXVoa25pd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTM4NzYsImV4cCI6MjA2NTIyOTg3Nn0.Qi6DWEQiI7bKwB6CGHWiGYPHB645bpyvdltMWkVonD4";

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate a unique session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Session management functions
export const sessionManager = {
  async createSession(
    gameData: any,
    player1Nickname: string
  ): Promise<Session> {
    const sessionId = generateSessionId();
    const player1Id = Math.random().toString(36).substring(2, 15);

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          session_id: sessionId,
          player1_id: player1Id,
          player1_nickname: player1Nickname,
          relationship_type: gameData.relationshipType,
          conversation_styles: gameData.conversationStyles,
          custom_question: gameData.customQuestion,
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

    console.log("=== JOIN SESSION DEBUG START ===");
    console.log("Attempting to join session:", sessionId);
    console.log("Player 2 nickname:", player2Nickname);
    console.log("Generated player 2 ID:", player2Id);

    // First, fetch the current session to check availability
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    console.log("Fetch session result:");
    console.log("- Session data:", session);
    console.log("- Fetch error:", fetchError);

    if (fetchError) {
      console.error("Error fetching session for join:", fetchError);
      throw fetchError;
    }

    // Room not found
    if (!session) {
      console.log("Session not found");
      throw new Error("Unable to join: This room does not exist.");
    }

    console.log("Session found, checking player2_id:");
    console.log("- player2_id value:", session.player2_id);
    console.log("- player2_id type:", typeof session.player2_id);
    console.log("- Is null?", session.player2_id === null);
    console.log("- Is empty string?", session.player2_id === "");

    // Check if room is already full
    if (session.player2_id !== null && session.player2_id !== "") {
      console.log("Room is full, player2_id already set to:", session.player2_id);
      throw new Error("Unable to join: This room already has two players.");
    }

    console.log("Room is available, attempting to join...");

    // Update the session to join as player2 using proper null check
    const { data, error } = await supabase
      .from('sessions')
      .update({ player2_id: player2Id, player2_nickname: player2Nickname })
      .eq('session_id', sessionId)
      .is('player2_id', null) // Use proper null check instead of .in()
      .select()
      .maybeSingle();

    console.log("Update session result:");
    console.log("- Updated data:", data);
    console.log("- Update error:", error);

    if (error) {
      console.error("Error updating session:", error);
      throw error;
    }

    // If no data returned, the update failed (likely room was taken by another player)
    if (!data) {
      console.log("Update failed - no data returned, room likely taken by another player");
      throw new Error("Unable to join: This room has been taken by another player. Please try again or ask for a new room code.");
    }

    console.log("Successfully joined session!");
    console.log("=== JOIN SESSION DEBUG END ===");

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
