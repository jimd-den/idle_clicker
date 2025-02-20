export class WorkSession {
  private startTime: Date | null;
  private endTime: Date | null;
  private elapsedTimeMs: number; // Elapsed time in milliseconds
  private clicks: number;
  // private timerService: TimerService; // REMOVE TimerService dependency - WorkSession should not depend on Infrastructure

  constructor() { // Removed TimerService from constructor
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    console.log("WorkSession: constructor - WorkSession instance created"); // ADDED LOG
  }

  start(): void {
    console.log("WorkSession: start() called - before start - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
    // Always start the timer when start is called
    this.startTime = new Date();
    this.endTime = null; // Clear endTime to indicate timer is running
    console.log("WorkSession: start() - timer started/restarted - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
    // this.timerService.start(); // REMOVE TimerService interaction - WorkSession should not depend on Infrastructure
  }

  pause(): void {
    console.log("WorkSession: pause() called - before pause - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
    if (this.startTime && !this.endTime) {
      this.endTime = new Date();
      console.log("WorkSession: pause() - timer paused - endTime:", this.endTime); // ADDED LOG
    }
    console.log("WorkSession: pause() - after pause - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
    // this.timerService.pause(); // REMOVE TimerService interaction - WorkSession should not depend on Infrastructure
  }

  reset(autoStart: boolean = false): void {
    console.log("WorkSession: reset() called - before reset - startTime:", this.startTime, "endTime:", this.endTime, "elapsedTimeMs:", this.elapsedTimeMs, "clicks:", this.clicks); // ADDED LOG
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    console.log("WorkSession: reset() - session reset - startTime:", this.startTime, "endTime:", this.endTime, "elapsedTimeMs:", this.elapsedTimeMs, "clicks:", this.clicks); // ADDED LOG

    if (autoStart) {
      console.log("WorkSession: reset() - auto-starting timer");
      this.start(); // Just start WorkSession timer logic, TimerService start is handled elsewhere
    }
  }

  recordClick(): void {
    this.clicks++;
    console.log("WorkSession: recordClick() called"); // ADDED LOG
    console.log("WorkSession: clicks incremented to:", this.clicks); // ADDED LOG
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
    console.log("WorkSession: getClicks() returning:", this.clicks); // ADDED LOG
    return this.clicks;
  }

  isRunning(): boolean {
    const running = !!this.startTime && !this.endTime;
    console.log("WorkSession: isRunning() - startTime:", this.startTime, "endTime:", this.endTime, "returning:", running); // ADDED LOG
    return running;
  }

  updateElapsedTime(elapsedTimeMs: number): void {
    this.elapsedTimeMs = elapsedTimeMs;
    console.log("WorkSession: updateElapsedTime() - elapsedTimeMs updated to:", this.elapsedTimeMs); // ADDED LOG
  }
}
