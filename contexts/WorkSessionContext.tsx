import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WorkSession } from '@/domain/entities/WorkSession';
import { WorkTimerServiceImpl } from '@/infrastructure/services/WorkTimerServiceImpl';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';

const WorkSessionContext = createContext<WorkSession | null>(null);
const WorkTimerServiceContext = createContext<WorkTimerServiceImpl | null>(null);

export function WorkSessionProvider({ children }: { children: React.ReactNode }) {
  // Create instances in state so they can be updated
  const [workSession, setWorkSession] = useState(() => new WorkSession());
  const [workTimerService, setWorkTimerService] = useState(() => {
    const service = new WorkTimerServiceImpl();
    // Initialize with required dependencies
    service.initialize(workSession);
    return service;
  });

  // Add method to reset/refresh instances
  const resetInstances = useCallback(() => {
    const newWorkSession = new WorkSession();
    const newWorkTimerService = new WorkTimerServiceImpl();
    newWorkTimerService.initialize(newWorkSession);
    setWorkSession(newWorkSession);
    setWorkTimerService(newWorkTimerService);
  }, []);

  useEffect(() => {
    // Listen for session changes
    const handleSessionChange = () => {
      resetInstances();
    };
    
    // Clean up on unmount
    return () => {
      // Any cleanup if needed
    };
  }, [resetInstances]);

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
