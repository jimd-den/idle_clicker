import React, { createContext, useContext, useState } from 'react';
import { WorkSession } from '@/domain/entities/WorkSession';
import { WorkTimerServiceImpl } from '@/infrastructure/services/WorkTimerServiceImpl';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';

const WorkSessionContext = createContext<WorkSession | null>(null);
const WorkTimerServiceContext = createContext<WorkTimerServiceImpl | null>(null);

export function WorkSessionProvider({ children }: { children: React.ReactNode }) {
  const [workSession] = useState(new WorkSession());
  const [smoothnessCalculator] = useState(new SmoothnessCalculator());
  const [rpgRewardSystem] = useState(new RPGRewardSystem());
  const [workTimerService] = useState(new WorkTimerServiceImpl());

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
