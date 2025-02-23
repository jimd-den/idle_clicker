/**
 * Application Layer - Ports
 * 
 * TimeService: Defines a port for time-related operations.
 * This abstracts away the concrete implementation of how time is managed.
 */

export interface TimeService {
  getCurrentTime(): number;
  getElapsedTime(startTime: number): number;
  formatDuration(durationMs: number): string;
}