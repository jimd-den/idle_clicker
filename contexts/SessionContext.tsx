import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { SessionService } from '@/application/services/SessionService';
import { Session, SessionNote } from '@/domain/entities/Session';

interface SessionContextType {
  startNewSession: () => Promise<Session>;
  endCurrentSession: (clicks: number, upm: number) => Promise<Session | null>;
  getCurrentSession: () => Session | null;
  getAllSessions: () => Session[];
  addNote: (note: SessionNote) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionService] = useState(() => new SessionService());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        setError(null);
        await sessionService.initialize();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize sessions');
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, [sessionService]);

  const startNewSession = useCallback(async () => {
    try {
      setError(null);
      return await sessionService.startNewSession();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start new session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [sessionService]);

  const endCurrentSession = useCallback(async (clicks: number, upm: number) => {
    try {
      setError(null);
      return await sessionService.endCurrentSession(clicks, upm);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [sessionService]);

  const getCurrentSession = useCallback(() => {
    return sessionService.getCurrentSession();
  }, [sessionService]);

  const getAllSessions = useCallback(() => {
    return sessionService.getAllSessions();
  }, [sessionService]);

  const addNote = useCallback(async (note: SessionNote) => {
    try {
      setError(null);
      await sessionService.addNote(note);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [sessionService]);

  const value = {
    startNewSession,
    endCurrentSession,
    getCurrentSession,
    getAllSessions,
    addNote,
    isLoading,
    error,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}