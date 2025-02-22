/**
 * Infrastructure Layer - Context Implementations
 * 
 * This context provides access to the WorkSession entity and its services
 * while keeping the implementation details of React Context in the infrastructure layer.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WorkSession } from '@/domain/entities/WorkSession';
import { WorkTimerService } from '@/application/services/WorkTimerService';
import { WorkSessionFactory } from '../factories/WorkSessionFactory';

const WorkSessionContext = createContext<WorkSession | null>(null);
const WorkTimerServiceContext = createContext<WorkTimerService | null>(null);
const factory = new WorkSessionFactory();

export function WorkSessionProvider({ children }: { children: React.ReactNode }) {
  const [workSession] = useState(() => new WorkSession());
  const [workTimerService] = useState(() => factory.createWorkTimerService(workSession));

  return (
    <WorkSessionContext.Provider value={workSession}>
      <WorkTimerServiceContext.Provider value={workTimerService}>
        {children}
      </WorkTimerServiceContext.Provider>
    </WorkSessionContext.Provider>
  );
}

export function useWorkSession() {
  const context = useContext(WorkSessionContext);
  if (!context) {
    throw new Error('useWorkSession must be used within a WorkSessionProvider');
  }
  return context;
}

export function useWorkTimerService() {
  const context = useContext(WorkTimerServiceContext);
  if (!context) {
    throw new Error('useWorkTimerService must be used within a WorkSessionProvider');
  }
  return context;
}