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
  private lastUpdate = 0;
  private lastMetricsString: string = '';

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
    if (this.metricsUpdateCallback === callback) return; // Prevent duplicate subscriptions
    
    this.metricsUpdateCallback = callback;
    this.workTimerService.onMetricsUpdate((metrics) => {
      const now = Date.now();
      if (now - this.lastUpdate > 16) { // Only update every 16ms
        this.lastUpdate = now;
        if (this.metricsUpdateCallback) {
          const stringifiedMetrics = JSON.stringify(metrics);
          if (this.lastMetricsString !== stringifiedMetrics) {
            this.lastMetricsString = stringifiedMetrics;
            this.metricsUpdateCallback(metrics);
          }
        }
      }
    });
  }

  clearMetricsUpdateCallback(): void {
    this.metricsUpdateCallback = null;
  }
}
