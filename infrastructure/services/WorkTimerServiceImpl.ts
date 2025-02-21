import { WorkTimerService } from '@/application/services/WorkTimerService';
import { MetricsUpdate } from '@/types/metrics';
import { SmoothnessCalculator } from '@/application/services/SmoothnessCalculator';
import { RPGRewardSystem } from '@/application/services/RPGRewardSystem';

export class WorkTimerServiceImpl implements WorkTimerService {
  private isTimerRunning: boolean = false;
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private clicks: number = 0;
  private metricsCallback: ((metrics: MetricsUpdate) => void) | null = null;
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  private clickTimes: number[] = [];
  private smoothnessCalculator: SmoothnessCalculator = new SmoothnessCalculator();
  private rpgRewardSystem: RPGRewardSystem = new RPGRewardSystem();

  private getCurrentMetricsState(): MetricsUpdate {
    const currentTime = Date.now();
    const elapsedTimeMs = this.isTimerRunning ? 
      (currentTime - this.startTime + this.elapsedTime) : 
      this.elapsedTime;
    
    const minutes = elapsedTimeMs / (1000 * 60);
    const upm = minutes > 0 ? this.clicks / minutes : 0;

    const metrics: MetricsUpdate = {
      elapsedTimeMs,
      upm,
      isRunning: this.isTimerRunning,
      clicks: this.clicks,
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

    if (this.clickTimes.length > 1) {
      const timeGaps = [];
      for (let i = 1; i < this.clickTimes.length; i++) {
        timeGaps.push(this.clickTimes[i] - this.clickTimes[i - 1]);
      }
      const smoothnessMetrics = this.smoothnessCalculator.calculateSmoothnessScore(timeGaps);
      const rewards = this.rpgRewardSystem.calculateRewards(smoothnessMetrics);
      metrics.smoothnessMetrics = smoothnessMetrics;
      metrics.rewards = rewards;
    }
    
    return metrics;
  }

  private startMetricsUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      if (this.metricsCallback) {
        this.metricsCallback(this.getCurrentMetricsState());
      }
    }, 100);
  }

  startTimer(): boolean {
    if (!this.isTimerRunning) {
      this.startTime = Date.now();
      this.isTimerRunning = true;
      this.startMetricsUpdate();
      return true;
    }
    return false;
  }

  pauseTimer(): boolean {
    if (this.isTimerRunning) {
      this.elapsedTime += Date.now() - this.startTime;
      this.isTimerRunning = false;
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
      return true;
    }
    return false;
  }

  resetSession(): MetricsUpdate {
    this.isTimerRunning = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.clicks = 0;
    this.clickTimes = [];
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    return this.getCurrentMetricsState();
  }

  incrementClicks(): void {
    this.clicks++;
    const currentTime = Date.now();
    this.clickTimes.push(currentTime);
    if (this.clickTimes.length > 10) {
      this.clickTimes.shift();
    }
    if (this.metricsCallback) {
      this.metricsCallback(this.getCurrentMetricsState());
    }
  }

  isRunning(): boolean {
    return this.isTimerRunning;
  }

  getElapsedTimeMs(): number {
    if (this.isTimerRunning) {
      return Date.now() - this.startTime + this.elapsedTime;
    }
    return this.elapsedTime;
  }

  getClicks(): number {
    return this.clicks;
  }

  getCurrentMetrics(): MetricsUpdate {
    return this.getCurrentMetricsState();
  }

  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void): void {
    this.metricsCallback = callback;
  }
}
