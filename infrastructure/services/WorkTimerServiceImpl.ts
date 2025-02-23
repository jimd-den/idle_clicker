/**
 * Infrastructure Layer - Implementations
 */

import { WorkTimerService, MetricsUpdate } from '@/application/services/WorkTimerService';
import { TimerService } from '@/application/ports/TimerService';
import { TimeService } from '@/application/ports/TimeService';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';
import { WorkSession } from '@/domain/entities/WorkSession';
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';

export class WorkTimerServiceImpl implements WorkTimerService {
  private readonly clickTimes: number[] = [];
  private metricsUpdateCallback: ((metrics: MetricsUpdate) => void) | null = null;

  constructor(
    private readonly workSession: WorkSession,
    private readonly timerService: TimerService,
    private readonly timeService: TimeService,
    private readonly smoothnessCalculator: SmoothnessCalculator,
    private readonly rpgRewardSystem: RPGRewardSystem,
    private readonly startTimerUseCase: StartTimerUseCase,
    private readonly pauseTimerUseCase: PauseTimerUseCase,
    private readonly incrementClicksUseCase: IncrementClicksUseCase,
    private readonly resetSessionUseCase: ResetSessionUseCase
  ) {
    this.timerService.onTimeUpdate(() => {
      if (this.metricsUpdateCallback) {
        this.metricsUpdateCallback(this.getCurrentMetrics());
      }
    });
  }

  startTimer(): boolean {
    console.log('WorkTimerService: startTimer called');
    this.startTimerUseCase.execute();
    this.timerService.start();
    const metrics = this.getCurrentMetrics();
    if (this.metricsUpdateCallback) {
      this.metricsUpdateCallback(metrics);
    }
    return true;
  }

  pauseTimer(): boolean {
    console.log('WorkTimerService: pauseTimer called');
    this.pauseTimerUseCase.execute();
    this.timerService.pause();
    const metrics = this.getCurrentMetrics();
    if (this.metricsUpdateCallback) {
      this.metricsUpdateCallback(metrics);
    }
    return false;
  }

  incrementClicks(): void {
    console.log('WorkTimerService: incrementClicks called');
    this.incrementClicksUseCase.execute();
    const currentTime = this.timeService.getCurrentTime();
    this.clickTimes.push(currentTime);
    if (this.clickTimes.length > 10) {
      this.clickTimes.shift();
    }
    
    // Always calculate metrics
    const timeGaps = this.calculateTimeGaps();
    const smoothnessMetrics = this.smoothnessCalculator.calculateSmoothnessScore(timeGaps);
    this.workSession.updateSmoothnessMetrics(smoothnessMetrics);
    const rewards = this.rpgRewardSystem.calculateRewards(smoothnessMetrics);
    this.workSession.updateRewards(rewards);
    
    // Immediate callback
    if (this.metricsUpdateCallback) {
      this.metricsUpdateCallback(this.getCurrentMetrics());
    }
  }

  resetSession(): MetricsUpdate {
    console.log('WorkTimerService: resetSession called');
    this.resetSessionUseCase.execute(true);
    this.timerService.reset();
    this.clickTimes.length = 0;
    const metrics = this.getCurrentMetrics();
    if (this.metricsUpdateCallback) {
      this.metricsUpdateCallback(metrics);
    }
    return metrics;
  }

  isRunning(): boolean {
    return this.workSession.isRunning();
  }

  getElapsedTimeMs(): number {
    return this.timerService.getElapsedTimeMs();
  }

  getClicks(): number {
    return this.workSession.getClicks();
  }

  getCurrentMetrics(): MetricsUpdate {
    const elapsedTimeMs = this.getElapsedTimeMs();
    return {
      elapsedTimeMs,
      upm: this.calculateUPM(elapsedTimeMs, this.getClicks()),
      isRunning: this.isRunning(),
      clicks: this.getClicks(),
      smoothnessMetrics: this.workSession.getSmoothnessMetrics(),
      rewards: this.workSession.getRewards()
    };
  }

  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void): void {
    this.metricsUpdateCallback = callback;
  }

  clearMetricsUpdateCallback(): void {
    this.metricsUpdateCallback = null;
  }

  private calculateUPM(elapsedTimeMs: number, clicks: number): number {
    const minutes = elapsedTimeMs / (1000 * 60);
    return minutes > 0 ? Math.round((clicks / minutes) * 10) / 10 : 0;
  }

  private calculateTimeGaps(): number[] {
    return this.clickTimes.slice(1).map((time, index) => time - this.clickTimes[index]);
  }
}
