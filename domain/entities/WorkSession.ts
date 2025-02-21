export class WorkSession {
  private startTime: Date | null;
  private endTime: Date | null;
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
    console.log("WorkSession: constructor - WorkSession instance created");
  }

  start(): void {
    console.log("WorkSession: start() called - START");
    console.log("WorkSession: start() - Before start - startTime:", this.startTime, "endTime:", this.endTime, "elapsedTimeMs:", this.elapsedTimeMs);
    this.startTime = new Date();
    this.endTime = null;
    console.log("WorkSession: start() - timer started/restarted - startTime:", this.startTime, "endTime:", this.endTime);
    console.log("WorkSession: start() called - END");
  }

  pause(): void {
    console.log("WorkSession: pause() called - START");
    console.log("WorkSession: pause() - before pause - startTime:", this.startTime, "endTime:", this.endTime, "elapsedTimeMs:", this.elapsedTimeMs);
    if (this.startTime && !this.endTime) {
      this.endTime = new Date();
      console.log("WorkSession: pause() - timer paused - endTime:", this.endTime);
    }
    console.log("WorkSession: pause() - after pause - startTime:", this.startTime, "endTime:", this.endTime);
    console.log("WorkSession: pause() called - END");
  }

  reset(autoStart: boolean = false): void {
    console.log("WorkSession: reset() called - START");
    console.log("WorkSession: reset() - before reset - startTime:", this.startTime, "endTime:", this.endTime, "elapsedTimeMs:", this.elapsedTimeMs, "clicks:", this.clicks);
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
    console.log("WorkSession: reset() - session reset - startTime:", this.startTime, "endTime:", this.endTime, "elapsedTimeMs:", this.elapsedTimeMs, "clicks:", this.clicks);

    if (autoStart) {
      console.log("WorkSession: reset() - auto-starting timer");
      this.start();
    }
    console.log("WorkSession: reset() called - END");
  }

  recordClick(): void {
    this.clicks++;
    console.log("WorkSession: recordClick() called");
    console.log("WorkSession: clicks incremented to:", this.clicks);
  }

  getElapsedTimeMs(): number {
    return this.elapsedTimeMs;
  }

  getStartTime(): Date | null {
    return this.startTime;
  }

  getEndTime(): Date | null {
    return this.endTime;
  }

  getClicks(): number {
    console.log("WorkSession: getClicks() returning:", this.clicks);
    return this.clicks;
  }

  isRunning(): boolean {
    const running = !!this.startTime && !this.endTime;
    console.log("WorkSession: isRunning() - startTime:", this.startTime, "endTime:", this.endTime, "returning:", running);
    return running;
  }

  updateElapsedTime(elapsedTimeMs: number): void {
    this.elapsedTimeMs = elapsedTimeMs;
    console.log("WorkSession: updateElapsedTime() - elapsedTimeMs updated to:", this.elapsedTimeMs);
  }

  updateSmoothnessMetrics(metrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  }): void {
    this.smoothnessMetrics = metrics;
    console.log("WorkSession: updateSmoothnessMetrics() - smoothnessMetrics updated to:", this.smoothnessMetrics);
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
    console.log("WorkSession: updateRewards() - rewards updated to:", this.rewards);
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
