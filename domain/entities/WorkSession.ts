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
    console.log("WorkSession: start() called"); // ADDED LOG
    if (!this.startTime) {
      this.startTime = new Date();
    }
  }

  pause(): void {
    console.log("WorkSession: pause() called"); // ADDED LOG
    if (this.startTime && !this.endTime) {
      this.endTime = new Date();
    }
  }

  recordClick(): void {
    console.log("WorkSession: recordClick() called"); // ADDED LOG
    this.clicks++;
    console.log("WorkSession: clicks incremented to:", this.clicks); // ADDED LOG
  }

  reset(): void {
    console.log("WorkSession: reset() called"); // ADDED LOG
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
    console.log("WorkSession: session reset - clicks:", this.clicks, "elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
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
    return !!this.startTime && !this.endTime;
  }
}
