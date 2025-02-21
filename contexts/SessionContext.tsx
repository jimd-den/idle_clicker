import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { SessionService } from '@/application/services/SessionService';
import { Session, SessionNote } from '@/domain/entities/Session';
import { setErrorState } from '@/utils/errorUtils';

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
        setErrorState(setError, err);
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
      setErrorState(setError, err);
      throw new Error(setErrorState(setError, err));
    }
  }, [sessionService]);

  const endCurrentSession = useCallback(async (clicks: number, upm: number) => {
    try {
      setError(null);
      return await sessionService.endCurrentSession(clicks, upm);
    } catch (err) {
      setErrorState(setError, err);
      throw new Error(setErrorState(setError, err));
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
      setErrorState(setError, err);
      throw new Error(setErrorState(setError, err));
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
