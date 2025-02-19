/**
 * Infrastructure Layer - Implementations
 *
 * TimerServiceImpl: Implements the TimerService port using JavaScript's
 * `setInterval` and `clearInterval`. This is a concrete implementation
 * of the timer functionality, dependent on the JavaScript environment.
 *
 * This class resides in the Infrastructure Layer because it deals with
 * framework-specific (in this case, JavaScript/browser/React Native timer APIs)
 * details.
 */

import { TimerService } from '@/application/ports/TimerService';

export class TimerServiceImpl implements TimerService {
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private elapsedTimeMs: number = 0;
  private lastUpdateTime: number = 0;
  private timeUpdateCallback: ((elapsedTimeMs: number) => void) | null = null;

  start(): void {
    if (!this.intervalId) {
      this.startTime = Date.now() - this.elapsedTimeMs; // Adjust start time based on elapsed time
      this.lastUpdateTime = Date.now();
      this.intervalId = setInterval(() => {
        const now = Date.now();
        this.elapsedTimeMs = now - this.startTime;
        this.lastUpdateTime = now;
        if (this.timeUpdateCallback) {
          this.timeUpdateCallback(this.elapsedTimeMs);
        }
      }, 1000); // Update every second
    }
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getElapsedTimeMs(): number {
    if (this.intervalId) {
      // Recalculate elapsed time if timer is running to ensure accuracy
      const now = Date.now();
      this.elapsedTimeMs = now - this.startTime;
      this.lastUpdateTime = now;
    }
    return this.elapsedTimeMs;
  }

  onTimeUpdate(callback: (elapsedTimeMs: number) => void): void {
    this.timeUpdateCallback = callback;
  }

  clearTimeUpdateCallback(): void {
    this.timeUpdateCallback = null;
  }
}
