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
    console.log("TimerServiceImpl: start() called"); // ADDED LOG
    if (!this.intervalId) {
      this.startTime = Date.now() - this.elapsedTimeMs; // Adjust start time based on elapsed time
      this.lastUpdateTime = Date.now();
      this.intervalId = setInterval(() => {
        const now = Date.now();
        this.elapsedTimeMs = now - this.startTime;
        this.lastUpdateTime = now;
        if (this.timeUpdateCallback) {
          console.log("TimerServiceImpl: onTimeUpdate callback invoked with elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
          this.timeUpdateCallback(this.elapsedTimeMs);
        }
      }, 16); // Update approximately every 16ms (60 FPS)
    }
  }

  pause(): void {
    console.log("TimerServiceImpl: pause() called"); // ADDED LOG
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
    console.log("TimerServiceImpl: getElapsedTimeMs() returning:", this.elapsedTimeMs); // ADDED LOG
    return this.elapsedTimeMs;
  }

  onTimeUpdate(callback: (elapsedTimeMs: number) => void): void {
    console.log("TimerServiceImpl: onTimeUpdate() setting callback"); // ADDED LOG
    this.timeUpdateCallback = callback;
  }

  clearTimeUpdateCallback(): void {
    console.log("TimerServiceImpl: clearTimeUpdateCallback() called"); // ADDED LOG
    this.timeUpdateCallback = null;
  }
}
