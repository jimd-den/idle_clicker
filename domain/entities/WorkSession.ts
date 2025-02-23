export class WorkSession {
  private startTime: number | null;
  private endTime: number | null;
  private elapsedTimeMs: number; // Elapsed time in milliseconds
  private clicks: number;
  private smoothnessMetrics: {
    consistency: number;  // 0-100 scale
    rhythm: number;      // Time between actions
    flowState: number;   // Consecutive smooth operations
    criticalSuccess: number; // Perfect timing instances
    criticalFailure: number; // Major disruptions
  };
  private rewards: {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  };

  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    this.smoothnessMetrics = {
      consistency: 0,
      rhythm: 0,
      flowState: 0,
      criticalSuccess: 0,
      criticalFailure: 0
    };
    this.rewards = {
      experience: 0,
      achievementPoints: 0,
      flowBonus: 0,
      streakMultiplier: 0
    };
  }

  start(timestamp: number): void {
    this.startTime = timestamp;
    this.endTime = null;
    this.elapsedTimeMs = 0;
  }

  pause(timestamp: number): void {
    if (this.startTime && !this.endTime) {
      this.endTime = timestamp;
      this.elapsedTimeMs = this.endTime - this.startTime;
    }
  }

  reset(timestamp?: number): void {
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    this.smoothnessMetrics = {
      consistency: 0,
      rhythm: 0,
      flowState: 0,
      criticalSuccess: 0,
      criticalFailure: 0
    };
    this.rewards = {
      experience: 0,
      achievementPoints: 0,
      flowBonus: 0,
      streakMultiplier: 0
    };
    
    if (timestamp) {
      this.start(timestamp);
    }
  }

  recordClick(): void {
    this.clicks++;
    // Ensure elapsedTimeMs is always current
    if (this.startTime && !this.endTime) {
      this.elapsedTimeMs = Date.now() - this.startTime;
    }
  }

  getElapsedTimeMs(): number {
    return this.elapsedTimeMs;
  }

  getStartTime(): number | null {
    return this.startTime;
  }

  getEndTime(): number | null {
    return this.endTime;
  }

  getClicks(): number {
    return this.clicks;
  }

  isRunning(): boolean {
    const running = !!this.startTime && !this.endTime;
    return running;
  }

  updateElapsedTime(elapsedTimeMs: number): void {
    this.elapsedTimeMs = elapsedTimeMs;
  }

  updateSmoothnessMetrics(metrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  }): void {
    this.smoothnessMetrics = metrics;
  }

  getSmoothnessMetrics(): {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  } {
    return this.smoothnessMetrics;
  }

  updateRewards(rewards: {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  }): void {
    this.rewards = rewards;
  }

  getRewards(): {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  } {
    return this.rewards;
  }
}
