export class WorkSession {
  private startTime: Date | null;
  private endTime: Date | null;
  private elapsedTimeMs: number;
  private clicks: number;
  private beforeImage: string | null;
  private afterImage: string | null;
  private units: Array<{
    timestamp: Date,
    batchSize: number,
    andonNote?: TimWoodsAndon
  }>;
  private sessionMetrics: {
    smoothnessIndex: number,
    totalUnits: number,
    totalStops: number,
    averageBatchSize: number
  };

  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    this.beforeImage = null;
    this.afterImage = null;
    this.units = [];
    this.sessionMetrics = {
      smoothnessIndex: 0,
      totalUnits: 0,
      totalStops: 0,
      averageBatchSize: 0
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
    this.beforeImage = null;
    this.afterImage = null;
    this.units = [];
    this.sessionMetrics = {
      smoothnessIndex: 0,
      totalUnits: 0,
      totalStops: 0,
      averageBatchSize: 0
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
}

interface TimWoodsAndon {
  type: 'Transportation' | 'Inventory' | 'Motion' | 'Waiting' | 
        'Overproduction' | 'Overprocessing' | 'Defects' | 'Skills';
  description: string;
  timestamp: Date;
}
