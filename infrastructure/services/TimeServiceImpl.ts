/**
 * Infrastructure Layer - Services
 * 
 * Implements the TimeService port using JavaScript's Date API
 */

import { TimeService } from '@/application/ports/TimeService';

export class TimeServiceImpl implements TimeService {
  getCurrentTime(): number {
    return Date.now();
  }

  getElapsedTime(startTime: number): number {
    return Date.now() - startTime;
  }

  formatDuration(durationMs: number): string {
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }
}