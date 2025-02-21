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

interface MetricsUpdate { // Define interface for metrics update
  elapsedTimeMs: number;
  upm: number;
  isRunning: boolean; // ADD isRunning to metrics
  clicks: number;     // ADD clicks to metrics
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

export class WorkTimerService {
  private workSession: WorkSession; // Now expects WorkSession to be injected
  private startTimerUseCase: StartTimerUseCase;
  private pauseTimerUseCase: PauseTimerUseCase;
  private incrementClicksUseCase: IncrementClicksUseCase;
  private resetSessionUseCase: ResetSessionUseCase;
  private timerService: TimerService;
  private smoothnessCalculator: SmoothnessCalculator;
  private rpgRewardSystem: RPGRewardSystem;
  private metricsUpdateCallback: ((metrics: MetricsUpdate) => void) | null = null; // Changed callback type

  /**
   * Constructor for WorkTimerService.
   *
   * Now expects WorkSession instance to be injected as a dependency,
   * along with Use Cases and TimerService.
   *
   * @param workSession - Injected WorkSession instance.
   * @param startTimerUseCase - Use case for starting the timer.
   * @param pauseTimerUseCase - Use case for pausing the timer.
   * @param incrementClicksUseCase - Use case for incrementing clicks.
   * @param resetSessionUseCase - Use case for resetting the session.
   * @param timerService - Infrastructure service for timer operations.
   * @param smoothnessCalculator - Service for calculating smoothness metrics.
   * @param rpgRewardSystem - Service for calculating RPG rewards.
   */
  constructor(
    workSession: WorkSession, // Expect WorkSession instance to be passed in
    startTimerUseCase: StartTimerUseCase,
    pauseTimerUseCase: PauseTimerUseCase,
    incrementClicksUseCase: IncrementClicksUseCase,
    resetSessionUseCase: ResetSessionUseCase,
    timerService: TimerService,
    smoothnessCalculator: SmoothnessCalculator,
    rpgRewardSystem: RPGRewardSystem
  ) {
    this.workSession = workSession; // Use the injected WorkSession instance
    this.startTimerUseCase = startTimerUseCase;
    this.pauseTimerUseCase = pauseTimerUseCase;
    this.incrementClicksUseCase = incrementClicksUseCase;
    this.resetSessionUseCase = resetSessionUseCase;
    this.timerService = timerService;
    this.smoothnessCalculator = smoothnessCalculator;
    this.rpgRewardSystem = rpgRewardSystem;

    console.log("WorkTimerService: constructor - WorkTimerService instance injected:", this.workSession); // ADDED LOG

    this.timerService.onTimeUpdate((elapsedTimeMs) => {
      // Calculate UPM here in the Application Layer
      const upm = this.calculateUPM(elapsedTimeMs, this.workSession.getClicks());
      const isRunning = this.workSession.isRunning(); // Get isRunning from WorkSession
      const clicks = this.workSession.getClicks();     // Get clicks from WorkSession

      // Calculate smoothness metrics
      const smoothnessMetrics = this.smoothnessCalculator.calculateSmoothnessScore([/* timeGaps */]);
      this.workSession.updateSmoothnessMetrics(smoothnessMetrics);

      // Calculate rewards
      const rewards = this.rpgRewardSystem.calculateRewards(smoothnessMetrics);
      this.workSession.updateRewards(rewards);

      const metrics: MetricsUpdate = { 
        elapsedTimeMs, 
        upm, 
        isRunning, 
        clicks, 
        smoothnessMetrics: this.workSession.getSmoothnessMetrics(), 
        rewards: this.workSession.getRewards() 
      }; // Create metrics object with isRunning and clicks
      console.log("WorkTimerService: onTimeUpdate callback - metrics:", metrics); // ADDED LOG
      // Notify listeners in the presentation layer with combined metrics update
      if (this.metricsUpdateCallback) {
        this.metricsUpdateCallback(metrics); // Send combined metrics update
      }
    });
  }

  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void) { // Changed callback type
    this.metricsUpdateCallback = callback;
  }

  clearMetricsUpdateCallback() { // Changed clear callback method name
    this.metricsUpdateCallback = null;
  }

  startTimer(): boolean {
    console.log("WorkTimerService: startTimer() - WorkSession instance:", this.workSession); // ADDED LOG
    this.startTimerUseCase.execute();
    this.timerService.start();
    return this.isRunning();
  }

  pauseTimer(): boolean {
    console.log("WorkTimerService: pauseTimer() - WorkSession instance:", this.workSession); // ADDED LOG
    this.pauseTimerUseCase.execute();
    this.timerService.pause();
    return this.isRunning();
  }

  incrementClicks(): void {
    console.log("WorkTimerService: incrementClicks() - WorkSession instance:", this.workSession); // ADDED LOG
    this.incrementClicksUseCase.execute();
    // UPM is now updated in the onTimeUpdate callback, no need to update it here
  }

  resetSession(): MetricsUpdate { // Modified to return MetricsUpdate
    console.log("WorkTimerService: resetSession() - WorkSession instance:", this.workSession); // ADDED LOG
    this.resetSessionUseCase.execute(true); // Execute ResetSessionUseCase, pass autoStart=true
    // No need to call timerService.reset() or timerService.start() here, it's handled in the use case or WorkSession
    return { // Return reset state
      isRunning: false,
      elapsedTimeMs: 0,
      upm: 0,
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
    };
  }

  isRunning(): boolean {
    console.log("WorkTimerService: isRunning() - WorkSession instance:", this.workSession); // ADDED LOG
    return this.workSession.isRunning();
  }

  getElapsedTimeMs(): number {
    console.log("WorkTimerService: getElapsedTimeMs() - WorkSession instance:", this.workSession); // ADDED LOG
    return this.timerService.getElapsedTimeMs();
  }

  getClicks(): number {
    console.log("WorkTimerService: getClicks() - WorkSession instance:", this.workSession); // ADDED LOG
    return this.workSession.getClicks();
  }

  getSmoothnessMetrics(): {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  } {
    return this.workSession.getSmoothnessMetrics();
  }

  getRewards(): {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  } {
    return this.workSession.getRewards();
  }

  private calculateUPM(elapsedTimeMs: number, clicks: number): number { // UPM calculation method
    let currentUPM = 0;
    if (elapsedTimeMs > 0) {
      currentUPM = Math.round((clicks / (elapsedTimeMs / 60000)) * 10) / 10;
    }
    return currentUPM;
  }

  // No longer need separate onElapsedTimeUpdate and onUPMUpdate, using combined onMetricsUpdate
  // onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
  //   this.timeUpdateCallback = callback;
  // }

  // clearElapsedTimeUpdateCallback() {
  //   this.timeUpdateCallback = null;
  // }
}
