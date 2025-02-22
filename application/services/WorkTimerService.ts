/**
 * Application Layer - Services
 *
 * WorkTimerService: Implements the application logic for the work timer.
 * It orchestrates the use cases from the Domain Layer and interacts
 * with the Infrastructure Layer through ports (like TimerService).
 *
 * This service is responsible for managing the work session state
 * and providing methods for the Presentation Layer to interact with
 * the timer functionality.
 */

import { WorkSession } from '@/domain/entities/WorkSession';
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { TimerService } from '@/application/ports/TimerService';
import { SmoothnessCalculator } from './SmoothnessCalculator';
import { RPGRewardSystem } from './RPGRewardSystem';

/**
 * Application Layer - Services
 *
 * WorkTimerService interface defines the contract for timer functionality
 * that the presentation layer can use, abstracting away implementation details.
 */

export interface MetricsUpdate {
  elapsedTimeMs: number;
  upm: number;
  isRunning: boolean;
  clicks: number;
  smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  };
  rewards: {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  };
}

export interface WorkTimerService {
  startTimer(): boolean;
  pauseTimer(): boolean;
  resetSession(): MetricsUpdate;
  incrementClicks(): void;
  isRunning(): boolean;
  getElapsedTimeMs(): number;
  getClicks(): number;
  getCurrentMetrics(): MetricsUpdate;
  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void): void;
  clearMetricsUpdateCallback(): void;
  clearPendingUpdates?(): void;
}
