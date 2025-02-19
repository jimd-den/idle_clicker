/**
 * Application Layer - Ports
 *
 * TimerService: Defines a port (interface) for timer-related operations.
 * This port abstracts away the concrete implementation of how the timer
 * is managed (e.g., using `setInterval`, device APIs, etc.).
 *
 * The Application Layer depends on this port, and the Infrastructure
 * Layer will implement it. This decouples the Application Layer from
 * specific timer implementations.
 */

export interface TimerService {
  start(): void;
  pause(): void;
  getElapsedTimeMs(): number;
  onTimeUpdate(callback: (elapsedTimeMs: number) => void): void;
  clearTimeUpdateCallback(): void;
}
