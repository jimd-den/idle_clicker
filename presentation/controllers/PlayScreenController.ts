/**
 * Presentation Layer - Controllers
 *
 * PlayScreenController: Handles the presentation logic for the PlayScreen.
 * It coordinates between the UI and application layer services.
 */

import { WorkTimerService, MetricsUpdate } from '@/application/services/WorkTimerService';
import { WorkSession } from '@/domain/entities/WorkSession';

export class PlayScreenController {
  private workSession: WorkSession;
  private workTimerService: WorkTimerService;
  private metricsUpdateCallback: ((metrics: MetricsUpdate) => void) | null = null;

  constructor(workSession: WorkSession, workTimerService: WorkTimerService) {
    this.workSession = workSession;
    this.workTimerService = workTimerService;
  }

  startTimer(): boolean {
    return this.workTimerService.startTimer();
  }

  pauseTimer(): boolean {
    return this.workTimerService.pauseTimer();
  }

  incrementClicks(): void {
    this.workTimerService.incrementClicks();
  }

  resetSession(): MetricsUpdate {
    return this.workTimerService.resetSession();
  }

  isRunning(): boolean {
    return this.workTimerService.isRunning();
  }

  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void): void {
    this.metricsUpdateCallback = callback;
    // Don't set up nested callbacks, just pass through
    this.workTimerService.onMetricsUpdate(callback);
  }

  clearMetricsUpdateCallback(): void {
    this.metricsUpdateCallback = null;
  }
}
