/**
 * Domain Layer - Entities
 *
 * WorkSession entity: Represents a user's work session.
 * It encapsulates the data related to a single work session,
 * such as start time, end time, elapsed time, and click count.
 *
 * This entity is pure domain logic and has no dependencies on
 * frameworks or UI.
 */

export class WorkSession {
  private startTime: Date | null;
  private endTime: Date | null;
  private elapsedTimeMs: number; // Elapsed time in milliseconds
  private clicks: number;

  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
  }

  start(): void {
    console.log("WorkSession: start() called - before start - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
    if (!this.startTime) {
      this.startTime = new Date();
      console.log("WorkSession: start() - timer started - startTime:", this.startTime); // ADDED LOG
    } else {
      console.log("WorkSession: start() - timer already started, ignoring call"); // ADDED LOG
    }
    console.log("WorkSession: start() - after start - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
  }

  pause(): void {
    console.log("WorkSession: pause() called - before pause - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
    if (this.startTime && !this.endTime) {
      this.endTime = new Date();
      console.log("WorkSession: pause() - timer paused - endTime:", this.endTime); // ADDED LOG
    } else {
      console.log("WorkSession: pause() - timer not running or already paused, ignoring call"); // ADDED LOG
    }
    console.log("WorkSession: pause() - after pause - startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
  }

  recordClick(): void {
    console.log("WorkSession: recordClick() called"); // ADDED LOG
    this.clicks++;
    console.log("WorkSession: clicks incremented to:", this.clicks); // ADDED LOG
  }

  reset(): void {
    console.log("WorkSession: reset() called - before reset - startTime:", this.startTime, "endTime:", this.endTime, "clicks:", this.clicks, "elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    console.log("WorkSession: reset() - session reset - clicks:", this.clicks, "elapsedTimeMs:", this.elapsedTimeMs, "startTime:", this.startTime, "endTime:", this.endTime); // ADDED LOG
  }

  getStartTime(): Date | null {
    return this.startTime;
  }

  getEndTime(): Date | null {
    return this.endTime;
  }

  getElapsedTimeMs(): number {
    return this.elapsedTimeMs;
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
}
