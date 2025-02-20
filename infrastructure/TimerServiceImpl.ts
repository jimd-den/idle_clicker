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
    console.log("TimerServiceImpl: start() called - START"); // ADDED LOG
    console.log("TimerServiceImpl: start() - Before start - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
    if (!this.intervalId) {
      this.startTime = Date.now() - this.elapsedTimeMs; // Adjust start time based on elapsed time
      this.lastUpdateTime = Date.now();
      this.intervalId = setInterval(() => {
        this.updateElapsedTime();
      }, 16); // Update approximately every 16ms (60 FPS)
    }
    console.log("TimerServiceImpl: start() - After start - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
    console.log("TimerServiceImpl: start() called - END"); // ADDED LOG
  }

  pause(): void {
    console.log("TimerServiceImpl: pause() called"); // ADDED LOG
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void { // ADDED reset method implementation back to TimerServiceImpl
    console.log("TimerServiceImpl: reset() called - START"); // ADDED LOG
    console.log("TimerServiceImpl: reset() - Before reset - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.startTime = 0; // Ensure startTime is reset to 0
    this.elapsedTimeMs = 0; // Ensure elapsedTimeMs is reset to 0
    this.lastUpdateTime = 0;
    console.log("TimerServiceImpl: reset() - After reset - intervalId:", this.intervalId, "startTime:", this.startTime, "elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
    console.log("TimerServiceImpl: reset() called - END"); // ADDED LOG
  }

  getElapsedTimeMs(): number {
    this.updateElapsedTime(); // Ensure elapsed time is up-to-date before returning
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

  private updateElapsedTime(): void {
    if (this.intervalId) {
      const now = Date.now();
      this.elapsedTimeMs = now - this.startTime;
      this.lastUpdateTime = now;
      if (this.timeUpdateCallback) {
        console.log("TimerServiceImpl: updateElapsedTime callback invoked with elapsedTimeMs:", this.elapsedTimeMs); // ADDED LOG
        this.timeUpdateCallback(this.elapsedTimeMs);
      }
    }
  }
}
