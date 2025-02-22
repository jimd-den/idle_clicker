import { Session, SessionNote } from '@/domain/entities/Session';
import { StorageService } from '@/application/ports/StorageService';
import { TimeService } from '@/application/ports/TimeService';

const SESSIONS_STORAGE_KEY = '@idle_clicker_sessions';
const CURRENT_SESSION_KEY = '@idle_clicker_current_session';

export class SessionService {
  private sessions: Session[] = [];
  private currentSession: Session | null = null;
  private initialized: boolean = false;

  constructor(
    private readonly storageService: StorageService,
    private readonly timeService: TimeService
  ) {}

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const storedSessions = await this.storageService.getItem(SESSIONS_STORAGE_KEY);
      if (storedSessions) {
        const sessionsData = JSON.parse(storedSessions);
        this.sessions = sessionsData.map(Session.fromJSON);
      }

      const currentSessionData = await this.storageService.getItem(CURRENT_SESSION_KEY);
      if (currentSessionData) {
        this.currentSession = Session.fromJSON(JSON.parse(currentSessionData));
      }

      this.initialized = true;
    } catch (error) {
      throw new Error('Failed to initialize SessionService: ' + error);
    }
  }

  private async persistSessions(): Promise<void> {
    try {
      const serializedSessions = this.sessions.map(session => session.toJSON());
      await this.storageService.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(serializedSessions));
    } catch (error) {
      throw new Error('Failed to persist sessions: ' + error);
    }
  }

  private async persistCurrentSession(): Promise<void> {
    try {
      if (this.currentSession) {
        await this.storageService.setItem(
          CURRENT_SESSION_KEY,
          JSON.stringify(this.currentSession.toJSON())
        );
      } else {
        await this.storageService.removeItem(CURRENT_SESSION_KEY);
      }
    } catch (error) {
      throw new Error('Failed to persist current session: ' + error);
    }
  }

  async startNewSession(): Promise<Session> {
    if (this.currentSession && !this.currentSession.isComplete()) {
      throw new Error('Cannot start new session while current session is active');
    }
    
    const currentTime = this.timeService.getCurrentTime();
    this.currentSession = new Session(String(currentTime), currentTime);
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
      const currentTime = this.timeService.getCurrentTime();
      this.currentSession.setTotalClicks(clicks);
      this.currentSession.setFinalUPM(upm);
      this.currentSession.updateSmoothnessMetrics(smoothnessMetrics);
      this.currentSession.setEndTime(currentTime);
      
      const completedSession = this.currentSession;
      this.currentSession = null;
      
      await this.persistSessions();
      await this.persistCurrentSession();
      
      return completedSession;
    }
    return null;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  getAllSessions(): Session[] {
    return [...this.sessions].sort((a, b) => b.getStartTime() - a.getStartTime());
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
      throw new Error('Failed to add note: ' + error);
    }
  }
}