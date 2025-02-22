import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, SessionNote } from '@/domain/entities/Session';

const SESSIONS_STORAGE_KEY = '@idle_clicker_sessions';
const CURRENT_SESSION_KEY = '@idle_clicker_current_session';

export class SessionService {
  private sessions: Session[] = [];
  private currentSession: Session | null = null;
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Load saved sessions
      const storedSessions = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
      if (storedSessions) {
        const sessionsData = JSON.parse(storedSessions);
        this.sessions = sessionsData.map(Session.fromJSON);
      }

      // Load current session if exists
      const currentSessionData = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
      if (currentSessionData) {
        this.currentSession = Session.fromJSON(JSON.parse(currentSessionData));
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize SessionService:', error);
      throw error;
    }
  }

  private async persistSessions(): Promise<void> {
    try {
      const serializedSessions = this.sessions.map(session => session.toJSON());
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(serializedSessions));
    } catch (error) {
      console.error('Failed to persist sessions:', error);
      throw error;
    }
  }

  private async persistCurrentSession(): Promise<void> {
    try {
      if (this.currentSession) {
        await AsyncStorage.setItem(
          CURRENT_SESSION_KEY,
          JSON.stringify(this.currentSession.toJSON())
        );
      } else {
        await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
      }
    } catch (error) {
      console.error('Failed to persist current session:', error);
      throw error;
    }
  }

  async startNewSession(): Promise<Session> {
    if (this.currentSession && !this.currentSession.isComplete()) {
      throw new Error('Cannot start new session while current session is active');
    }
    
    this.currentSession = new Session();
    this.sessions.push(this.currentSession);
    
    await this.persistSessions();
    await this.persistCurrentSession();
    
    return this.currentSession;
  }

  async endCurrentSession(
    clicks: number, 
    upm: number, 
    smoothnessMetrics: {
      consistency: number;
      rhythm: number;
      flowState: number;
      criticalSuccess: number;
      criticalFailure: number;
    }
  ): Promise<Session | null> {
    if (this.currentSession && !this.currentSession.isComplete()) {
      try {
        this.currentSession.setTotalClicks(clicks);
        this.currentSession.setFinalUPM(upm);
        this.currentSession.updateSmoothnessMetrics(smoothnessMetrics);
        this.currentSession.setEndTime(new Date());
        
        const completedSession = this.currentSession;
        this.currentSession = null;
        
        await this.persistSessions();
        await this.persistCurrentSession();
        
        return completedSession;
      } catch (error) {
        console.error('Failed to end current session:', error);
        throw error;
      }
    }
    return null;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  getAllSessions(): Session[] {
    return [...this.sessions].sort((a, b) => 
      b.getStartTime().getTime() - a.getStartTime().getTime()
    );
  }

  async addNote(note: SessionNote): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session to add note to');
    }

    try {
      this.currentSession.addNote(note);
      await this.persistSessions();
      await this.persistCurrentSession();
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  }
}