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
}

export class WorkTimerServiceImpl implements WorkTimerService {
  private workSession: WorkSession; // Now expects WorkSession to be injected
  private startTimerUseCase: StartTimerUseCase;
  private pauseTimerUseCase: PauseTimerUseCase;
  private incrementClicksUseCase: IncrementClicksUseCase;
  private resetSessionUseCase: ResetSessionUseCase;
  private timerService: TimerService;
  private smoothnessCalculator: SmoothnessCalculator;
  private rpgRewardSystem: RPGRewardSystem;
  private metricsUpdateCallback: ((metrics: MetricsUpdate) => void) | null = null; // Changed callback type
  private clickTimes: number[] = []; // Add array to store click times

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
      const upm = this.calculateUPM(elapsedTimeMs, this.workSession.getClicks());
      const isRunning = this.workSession.isRunning();
      const clicks = this.workSession.getClicks();

      // Only calculate new smoothness if we have clicks
      const timeGaps = this.calculateTimeGaps();
      if (timeGaps.length > 0) {
        const smoothnessMetrics = this.smoothnessCalculator.calculateSmoothnessScore(timeGaps);
        this.workSession.updateSmoothnessMetrics(smoothnessMetrics);
        
        const rewards = this.rpgRewardSystem.calculateRewards(smoothnessMetrics);
        this.workSession.updateRewards(rewards);
      }

      const metrics: MetricsUpdate = {
        elapsedTimeMs,
        upm,
        isRunning,
        clicks,
        smoothnessMetrics: this.workSession.getSmoothnessMetrics(),
        rewards: this.workSession.getRewards()
      };

      if (this.metricsUpdateCallback) {
        this.metricsUpdateCallback(metrics);
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
    
    const currentTime = Date.now();
    this.clickTimes.push(currentTime);
    console.log('Click times array:', this.clickTimes);
    
    // Keep only last 10 clicks to avoid memory growth
    if (this.clickTimes.length > 10) {
      this.clickTimes.shift();
    }
    
    // Calculate new metrics from click times
    const timeGaps = this.calculateTimeGaps();
    const smoothnessMetrics = this.smoothnessCalculator.calculateSmoothnessScore(timeGaps);
    console.log('Calculated smoothness metrics:', smoothnessMetrics);
    this.workSession.updateSmoothnessMetrics(smoothnessMetrics);

    const rewards = this.rpgRewardSystem.calculateRewards(smoothnessMetrics);
    this.workSession.updateRewards(rewards);

    // Force a metrics update
    if (this.metricsUpdateCallback) {
      this.metricsUpdateCallback(this.getCurrentMetrics());
    }
  }

  resetSession(): MetricsUpdate { // Modified to return MetricsUpdate
    console.log("WorkTimerService: resetSession() - WorkSession instance:", this.workSession); // ADDED LOG
    this.resetSessionUseCase.execute(true); // Execute ResetSessionUseCase, pass autoStart=true
    // No need to call timerService.reset() or timerService.start() here, it's handled in the use case or WorkSession
    this.clickTimes = []; // Reset click times array
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

  private calculateTimeGaps(): number[] {
    const timeGaps = [];
    for (let i = 1; i < this.clickTimes.length; i++) {
      timeGaps.push(this.clickTimes[i] - this.clickTimes[i-1]);
    }
    console.log('Calculated time gaps:', timeGaps);
    return timeGaps;
  }

  getCurrentMetrics(): MetricsUpdate {
    return {
      elapsedTimeMs: this.getElapsedTimeMs(),
      upm: this.calculateUPM(this.getElapsedTimeMs(), this.getClicks()),
      isRunning: this.isRunning(),
      clicks: this.getClicks(),
      smoothnessMetrics: this.getSmoothnessMetrics(),
      rewards: this.getRewards()
    };
  }

  // No longer need separate onElapsedTimeUpdate and onUPMUpdate, using combined onMetricsUpdate
  // onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
  //   this.timeUpdateCallback = callback;
  // }

  // clearElapsedTimeUpdateCallback() {
  //   this.timeUpdateCallback = null;
  // }
}
