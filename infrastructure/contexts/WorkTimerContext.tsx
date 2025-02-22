/**
 * Infrastructure Layer - Context Implementations
 * 
 * This context provides timer-related functionality while keeping
 * the implementation details of React Context in the infrastructure layer.
 */

import React, { createContext, useContext, useState } from 'react';
import { MetricsUpdate, WorkTimerService } from '@/application/services/WorkTimerService';
import { TimerService } from '@/application/ports/TimerService';
import { TimeService } from '@/application/ports/TimeService';
import { WorkTimerServiceImpl } from '@/infrastructure/services/WorkTimerServiceImpl';
import { WorkSession } from '@/domain/entities/WorkSession';
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';
import { TimerServiceImpl } from '@/infrastructure/TimerServiceImpl';
import { TimeServiceImpl } from '@/infrastructure/services/TimeServiceImpl';
import { useWorkSession } from './WorkSessionContext';

interface WorkTimerContextType {
  elapsedTimeMs: number;
  upm: number;
  isRunning: boolean;
  clicks: number;
  metrics: MetricsUpdate;
  timerService: WorkTimerService;
}

const WorkTimerContext = createContext<WorkTimerContextType | null>(null);

export function WorkTimerProvider({ children }: { children: React.ReactNode }) {
  const workSession = useWorkSession();
  
  const [workTimerService] = useState(() => {
    const timeService = new TimeServiceImpl();
    const timerService = new TimerServiceImpl(timeService);
    const smoothnessCalculator = new SmoothnessCalculator();
    const rpgRewardSystem = new RPGRewardSystem();
    
    // Create use cases
    const startTimerUseCase = new StartTimerUseCase(workSession, timeService);
    const pauseTimerUseCase = new PauseTimerUseCase(workSession, timeService);
    const incrementClicksUseCase = new IncrementClicksUseCase(workSession);
    const resetSessionUseCase = new ResetSessionUseCase(workSession, timeService);

    return new WorkTimerServiceImpl(
      workSession,
      timerService,
      timeService,
      smoothnessCalculator,
      rpgRewardSystem,
      startTimerUseCase,
      pauseTimerUseCase,
      incrementClicksUseCase,
      resetSessionUseCase
    );
  });

  const [metrics, setMetrics] = useState<MetricsUpdate>({
    elapsedTimeMs: 0,
    upm: 0,
    isRunning: false,
    clicks: 0,
    smoothnessMetrics: {
      consistency: 0,
      rhythm: 0,
      flowState: 0,
      criticalSuccess: 0,
      criticalFailure: 0
    },
    rewards: {
      experience: 0,
      achievementPoints: 0,
      flowBonus: 0,
      streakMultiplier: 0
    }
  });

  // Keep metrics in sync with debouncing
  React.useEffect(() => {
    let lastMetricsString = '';
    const updateMetrics = (newMetrics: MetricsUpdate) => {
      const newMetricsString = JSON.stringify(newMetrics);
      if (lastMetricsString !== newMetricsString) {
        lastMetricsString = newMetricsString;
        setMetrics(newMetrics);
      }
    };

    workTimerService.onMetricsUpdate(updateMetrics);
    return () => {
      workTimerService.clearMetricsUpdateCallback();
      if (workTimerService.clearPendingUpdates) {
        workTimerService.clearPendingUpdates();
      }
    };
  }, [workTimerService]);

  const contextValue = React.useMemo(() => ({
    elapsedTimeMs: metrics.elapsedTimeMs,
    upm: metrics.upm,
    isRunning: metrics.isRunning,
    clicks: metrics.clicks,
    metrics,
    timerService: workTimerService
  }), [metrics, workTimerService]);

  return (
    <WorkTimerContext.Provider value={contextValue}>
      {children}
    </WorkTimerContext.Provider>
  );
}

export function useWorkTimer() {
  const context = useContext(WorkTimerContext);
  if (!context) {
    throw new Error('useWorkTimer must be used within a WorkTimerProvider');
  }
  return context;
}