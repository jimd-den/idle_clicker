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
    console.log('Controller: startTimer called');
    return this.workTimerService.startTimer();
  }

  pauseTimer(): boolean {
    console.log('Controller: pauseTimer called');
    return this.workTimerService.pauseTimer();
  }

  incrementClicks(): void {
    console.log('Controller: incrementClicks called');
    this.workTimerService.incrementClicks();
  }

  resetSession(): MetricsUpdate {
    return this.workTimerService.resetSession();
  }

  isRunning(): boolean {
    return this.workTimerService.isRunning();
  }

  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void): void {
    if (this.metricsUpdateCallback === callback) return; // Prevent duplicate subscriptions
    
    this.metricsUpdateCallback = callback;
    this.workTimerService.onMetricsUpdate((metrics) => {
      if (this.metricsUpdateCallback) {
        this.metricsUpdateCallback(metrics);
      }
    });
  }

  clearMetricsUpdateCallback(): void {
    this.metricsUpdateCallback = null;
  }
}
