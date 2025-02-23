/**
 * Application Layer - Ports
 *
 * TimerService: Defines a port (interface) for timer-related operations.
 * This port abstracts away the concrete implementation of how the timer
 * is managed (e.g., using setInterval, device APIs, etc.).
 */

export interface TimerService {
  start(): void;
  pause(): void;
  reset(): void;
  getElapsedTimeMs(): number;
  onTimeUpdate(callback: (elapsedTimeMs: number) => void): void;
  clearTimeUpdateCallback(): void;
}
