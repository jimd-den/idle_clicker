import React, { createContext, useRef } from 'react';
import { WorkSession } from '@/domain/entities/WorkSession';
import { TimerServiceImpl } from '@/infrastructure/TimerServiceImpl'; // Import concrete TimerServiceImpl
import { WorkTimerService } from '@/application/services/WorkTimerService'; // Import WorkTimerService
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { TimerService } from '@/application/ports/TimerService'; // Import TimerService port
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator'; // Import SmoothnessCalculator
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem'; // Import RPGRewardSystem

interface WorkSessionContextProps {
  workSession: WorkSession;
  workTimerService: WorkTimerService; // Add WorkTimerService to context
}

// Create context for WorkSession and WorkTimerService
export const WorkSessionContext = createContext<WorkSessionContextProps | undefined>(
  undefined
);

export const WorkSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const workSessionRef = useRef<WorkSession | null>(null);
  const timerServiceImplRef = useRef<TimerService | null>(null); // Ref for TimerServiceImpl
  const workTimerServiceRef = useRef<WorkTimerService | null>(null); // Ref for WorkTimerService
  const smoothnessCalculatorRef = useRef<SmoothnessCalculator | null>(null); // Ref for SmoothnessCalculator
  const rpgRewardSystemRef = useRef<RPGRewardSystem | null>(null); // Ref for RPGRewardSystem

  if (!workSessionRef.current) {
    workSessionRef.current = new WorkSession();
  }
  const workSession = workSessionRef.current;

  if (!timerServiceImplRef.current) {
    timerServiceImplRef.current = new TimerServiceImpl();
  }
  const timerService = timerServiceImplRef.current;

  if (!smoothnessCalculatorRef.current) {
    smoothnessCalculatorRef.current = new SmoothnessCalculator();
  }
  const smoothnessCalculator = smoothnessCalculatorRef.current;

  if (!rpgRewardSystemRef.current) {
    rpgRewardSystemRef.current = new RPGRewardSystem();
  }
  const rpgRewardSystem = rpgRewardSystemRef.current;

  if (!workTimerServiceRef.current) {
    // Create Use Case instances, injecting the WorkSession
    const startTimerUseCase = new StartTimerUseCase(workSession);
    const pauseTimerUseCase = new PauseTimerUseCase(workSession);
    const incrementClicksUseCase = new IncrementClicksUseCase(workSession);
    const resetSessionUseCase = new ResetSessionUseCase(workSession);

    // Create WorkTimerService, injecting WorkSession, Use Cases, and TimerService
    workTimerServiceRef.current = new WorkTimerService(
      workSession,
      startTimerUseCase,
      pauseTimerUseCase,
      incrementClicksUseCase,
      resetSessionUseCase,
      timerService, // Inject the TimerServiceImpl instance
      smoothnessCalculator, // Inject the SmoothnessCalculator instance
      rpgRewardSystem // Inject the RPGRewardSystem instance
    );
  }
  const workTimerService = workTimerServiceRef.current;

  return (
    <WorkSessionContext.Provider value={{ workSession, workTimerService }}> {/* Provide both in context */}
      {children}
    </WorkSessionContext.Provider>
  );
};

export const useWorkSession = () => {
  const context = React.useContext(WorkSessionContext);
  if (!context) {
    throw new Error("useWorkSession must be used within a WorkSessionProvider");
  }
  return context.workSession;
};

export const useWorkTimerService = () => {
  const context = React.useContext(WorkSessionContext);
  if (!context) {
    throw new Error("useWorkTimerService must be used within a WorkSessionProvider");
  }
  return context.workTimerService; // Hook to access WorkTimerService
};
