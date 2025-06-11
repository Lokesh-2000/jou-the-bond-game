
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface GameState {
  player1_position: number;
  player2_position: number;
  current_turn: 'player1' | 'player2';
  last_dice_roll: number;
  questions_triggered: number[];
  game_started: boolean;
  game_ended: boolean;
  winner: string | null;
}

export interface Session {
  id: string;
  session_id: string;
  player1_id: string;
  player1_nickname: string | null;
  player2_id: string | null;
  player2_nickname: string | null;
  game_state: GameState;
  relationship_type: string | null;
  conversation_styles: string[] | null;
  custom_question: string | null;
  created_at: string;
  updated_at: string;
}

export class SessionManager {
  private channel: RealtimeChannel | null = null;
  private onSessionUpdateCallback: ((session: Session) => void) | null = null;

  async createSession(gameData: any, playerNickname: string): Promise<string> {
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const playerId = Math.random().toString(36).substring(2, 10);

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        session_id: sessionId,
        player1_id: playerId,
        player1_nickname: playerNickname,
        relationship_type: gameData.relationshipType,
        conversation_styles: gameData.conversationStyles,
        custom_question: gameData.customQuestion
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }

    return sessionId;
  }

  async joinSession(sessionId: string, playerNickname: string): Promise<Session | null> {
    const playerId = Math.random().toString(36).substring(2, 10);

    // First, check if the session exists and has space for player 2
    const { data: existingSession, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      throw new Error('Failed to fetch session');
    }

    if (!existingSession) {
      return null; // Session not found
    }

    if (existingSession.player2_id) {
      throw new Error('Session is already full');
    }

    // Update the session with player 2 info and start the game
    const currentGameState = existingSession.game_state as GameState;
    const updatedGameState = {
      ...currentGameState,
      game_started: true
    };

    const { data, error } = await supabase
      .from('sessions')
      .update({
        player2_id: playerId,
        player2_nickname: playerNickname,
        game_state: updatedGameState
      })
      .eq('id', existingSession.id)
      .select()
      .single();

    if (error) {
      console.error('Error joining session:', error);
      throw new Error('Failed to join session');
    }

    return {
      ...data,
      game_state: data.game_state as GameState,
      conversation_styles: data.conversation_styles as string[] | null
    } as Session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      game_state: data.game_state as GameState,
      conversation_styles: data.conversation_styles as string[] | null
    } as Session;
  }

  async updateGameState(sessionId: string, gameState: Partial<GameState>): Promise<void> {
    const { data: session } = await supabase
      .from('sessions')
      .select('game_state')
      .eq('session_id', sessionId)
      .single();

    if (!session) return;

    const currentGameState = session.game_state as GameState;
    const updatedGameState = {
      ...currentGameState,
      ...gameState
    };

    const { error } = await supabase
      .from('sessions')
      .update({ game_state: updatedGameState })
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error updating game state:', error);
    }
  }

  subscribeToSession(sessionId: string, onUpdate: (session: Session) => void): void {
    this.onSessionUpdateCallback = onUpdate;
    
    this.channel = supabase
      .channel(`session_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Session updated:', payload);
          if (payload.new) {
            const session = {
              ...payload.new,
              game_state: payload.new.game_state as GameState,
              conversation_styles: payload.new.conversation_styles as string[] | null
            } as Session;
            onUpdate(session);
          }
        }
      )
      .subscribe();
  }

  unsubscribeFromSession(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.onSessionUpdateCallback = null;
  }
}

export const sessionManager = new SessionManager();
