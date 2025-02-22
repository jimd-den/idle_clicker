/**
 * Infrastructure Layer - Context Implementations
 * 
 * This context provides access to the Session entity and its services
 * while keeping the implementation details of React Context in the infrastructure layer.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionService } from '@/application/services/SessionService';
import { SessionFactory } from '../factories/SessionFactory';

const SessionContext = createContext<SessionService | null>(null);
const factory = new SessionFactory();

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionService] = useState(() => factory.createSessionService());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeService = async () => {
      try {
        await sessionService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize session service:', error);
        // Still set as initialized to prevent infinite loops, but with empty state
        setIsInitialized(true);
      }
    };
    initializeService();
  }, [sessionService]);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <SessionContext.Provider value={sessionService}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionService() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionService must be used within a SessionProvider');
  }
  return context;
}