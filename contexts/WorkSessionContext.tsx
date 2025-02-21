import React, { createContext, useContext } from 'react';
import { WorkSession } from '@/domain/entities/WorkSession';
import { WorkTimerServiceImpl } from '@/infrastructure/services/WorkTimerServiceImpl';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';

const WorkSessionContext = createContext<WorkSession | null>(null);
const WorkTimerServiceContext = createContext<WorkTimerServiceImpl | null>(null);

export function WorkSessionProvider({ children }: { children: React.ReactNode }) {
  const workSession = new WorkSession();
  const smoothnessCalculator = new SmoothnessCalculator();
  const rpgRewardSystem = new RPGRewardSystem();
  const workTimerService = new WorkTimerServiceImpl();

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
