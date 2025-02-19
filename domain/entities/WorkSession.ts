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
    if (!this.startTime) {
      this.startTime = new Date();
    }
  }

  pause(): void {
    if (this.startTime && !this.endTime) {
      this.endTime = new Date();
    }
  }

  recordClick(): void {
    this.clicks++;
  }

  reset(): void {
    this.startTime = null;
    this.endTime = null;
    this.elapsedTimeMs = 0;
    this.clicks = 0;
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
    return this.clicks;
  }

  isRunning(): boolean {
    return !!this.startTime && !this.endTime;
  }
}
