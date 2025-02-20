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
    console.log("TimerServiceImpl: start() called - START");
    console.log("TimerServiceImpl: start() - Before start - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs);
    if (!this.intervalId) {
      this.startTime = Date.now(); // <---- MODIFIED: Always set startTime to current Date.now()
      this.lastUpdateTime = Date.now();
      this.intervalId = setInterval(() => {
        this.updateElapsedTime();
      }, 16); // Update approximately every 16ms (60 FPS)
    }
    console.log("TimerServiceImpl: start() - After start - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs);
    console.log("TimerServiceImpl: start() called - END");
  }

  pause(): void {
    console.log("TimerServiceImpl: pause() called");
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    console.log("TimerServiceImpl: reset() called - START");
    console.log("TimerServiceImpl: reset() - Before reset - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs);
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.startTime = 0;
    this.elapsedTimeMs = 0;
    this.lastUpdateTime = 0;
    console.log("TimerServiceImpl: reset() - After reset - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs);
    console.log("TimerServiceImpl: reset() called - END");
  }

  getElapsedTimeMs(): number {
    this.updateElapsedTime();
    console.log("TimerServiceImpl: getElapsedTimeMs() returning:", this.elapsedTimeMs);
    return this.elapsedTimeMs;
  }

  onTimeUpdate(callback: (elapsedTimeMs: number) => void): void {
    console.log("TimerServiceImpl: onTimeUpdate() setting callback");
    this.timeUpdateCallback = callback;
  }

  clearTimeUpdateCallback(): void {
    console.log("TimerServiceImpl: clearTimeUpdateCallback() called");
    this.timeUpdateCallback = null;
  }

  private updateElapsedTime(): void {
    if (this.intervalId) {
      const now = Date.now();
      this.elapsedTimeMs = now - this.startTime;
      this.lastUpdateTime = now;
      if (this.timeUpdateCallback) {
        console.log("TimerServiceImpl: updateElapsedTime callback invoked with elapsedTimeMs:", this.elapsedTimeMs);
        this.timeUpdateCallback(this.elapsedTimeMs);
      }
    }
  }
}
