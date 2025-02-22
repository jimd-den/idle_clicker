/**
 * Infrastructure Layer - Implementations
 *
 * TimerServiceImpl: Implements the TimerService port using JavaScript's
 * setInterval API. This implementation is framework-specific but hidden
 * behind the TimerService port.
 */

import { TimerService } from '@/application/ports/TimerService';
import { TimeService } from '@/application/ports/TimeService';

export class TimerServiceImpl implements TimerService {
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private elapsedTimeMs: number = 0;
  private timeUpdateCallback: ((elapsedTimeMs: number) => void) | null = null;
  private lastUpdate: number = 0;

  constructor(private readonly timeService: TimeService) {}

  start(): void {
    if (!this.intervalId) {
      this.startTime = this.timeService.getCurrentTime();
      this.intervalId = setInterval(() => this.updateElapsedTime(), 16);
    }
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.startTime = 0;
    this.elapsedTimeMs = 0;
  }

  getElapsedTimeMs(): number {
    this.updateElapsedTime();
    return this.elapsedTimeMs;
  }

  onTimeUpdate(callback: (elapsedTimeMs: number) => void): void {
    this.timeUpdateCallback = callback;
  }

  clearTimeUpdateCallback(): void {
    this.timeUpdateCallback = null;
  }

  private updateElapsedTime(): void {
    if (this.intervalId) {
      const now = this.timeService.getCurrentTime();
      if (now - this.lastUpdate >= 16) {  // Only update if 16ms has passed
        this.lastUpdate = now;
        this.elapsedTimeMs = now - this.startTime;
        if (this.timeUpdateCallback) {
          this.timeUpdateCallback(this.elapsedTimeMs);
        }
      }
    }
  }
}
