/**
 * Infrastructure Layer - Factories
 * 
 * Creates and wires up all dependencies following Clean Architecture principles
 */

import { WorkSession } from '@/domain/entities/WorkSession';
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { TimerServiceImpl } from '../TimerServiceImpl';
import { TimeServiceImpl } from '../services/TimeServiceImpl';
import { WorkTimerServiceImpl } from '../services/WorkTimerServiceImpl';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';

export class WorkSessionFactory {
  createWorkTimerService(workSession: WorkSession) {
    const timeService = new TimeServiceImpl();
    const timerService = new TimerServiceImpl(timeService);
    const smoothnessCalculator = new SmoothnessCalculator();
    const rpgRewardSystem = new RPGRewardSystem();
    
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
  }
}