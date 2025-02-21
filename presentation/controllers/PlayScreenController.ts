/**
 * Presentation Layer - Controllers
 */

interface MetricsUpdate {
  smoothnessMetrics: { consistency: number; rhythm: number; flowState: number; criticalSuccess: number; criticalFailure: number; };
  rewards: { experience: number; achievementPoints: number; flowBonus: number; streakMultiplier: number; };
  elapsedTimeMs: number;
  upm: number;
  isRunning: boolean;
  clicks: number;
}

/**
 * Presentation Layer - Controllers
 *
 * PlayScreenController: Controller for the PlayScreen.
 * It mediates between the PlayScreen UI and the Application Layer (WorkTimerService).
 *
 * It handles user interactions from the PlayScreen and calls the appropriate
 * methods in the WorkTimerService to perform actions. It also formats data
 * for display in the UI.
 *
 * This controller is specific to the PlayScreen and is responsible for
 * presentation logic.
 */

import { WorkTimerService } from '@/application/services/WorkTimerService'; // Import WorkTimerService
// Removed direct imports of Infrastructure and Use Cases
// import { TimerServiceImpl } from '@/infrastructure/TimerServiceImpl';
// import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
// import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
// import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
// import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { WorkSession } from '@/domain/entities/WorkSession';

export class PlayScreenController {
  private workTimerService: WorkTimerService; // Now depends on WorkTimerService, injected
  private workSessionInstance: WorkSession; // Keep track of WorkSession instance
  private metricsUpdateCallback: ((metrics: MetricsUpdate) => void) | null = null; // Changed to MetricsUpdate callback

  /**
   * Constructor for PlayScreenController.
   * Now accepts a WorkSession instance and a WorkTimerService instance as dependencies.
   *
   * @param workSession - Injected WorkSession instance from Presentation Layer.
   * @param workTimerService - Injected WorkTimerService instance.
   */
  constructor(workSession: WorkSession, workTimerService: WorkTimerService) { // Modified constructor to accept WorkTimerService
    this.workSessionInstance = workSession; // Use the injected WorkSession instance
    this.workTimerService = workTimerService; // Use the injected WorkTimerService

    console.log("PlayScreenController: constructor - WorkTimerService injected");
    console.log("PlayScreenController: constructor - WorkSession instance:", this.workSessionInstance);

    // Set up metrics update callback from WorkTimerService
    this.workTimerService.onMetricsUpdate((metrics) => { // Listen for combined metrics update
      console.log("PlayScreenController: onMetricsUpdate - metrics callback triggered:", metrics); // ADDED LOG
      if (this.metricsUpdateCallback) {
        this.metricsUpdateCallback(metrics); // Forward all metrics update to UI
      }
    });
  }

  private log(methodName: string) {
    console.log(`PlayScreenController: ${methodName}() - WorkSession instance:`, this.workSessionInstance);
  }

  startTimer(): boolean { // Modified to return boolean
    this.log("startTimer");
    return this.workTimerService.startTimer(); // Now just call service method
  }

  pauseTimer(): boolean { // Modified to return boolean
    this.log("pauseTimer");
    return this.workTimerService.pauseTimer(); // Now just call service method
  }

  incrementClicks(callback: (clicks: number) => void) {
    // Simply call the service method
    this.workTimerService.incrementClicks();
    
    // Get full metrics update and pass to UI
    if (this.metricsUpdateCallback) {
      this.metricsUpdateCallback(this.workTimerService.getCurrentMetrics());
    }
    
    // Update click count specifically
    callback(this.workTimerService.getClicks());
  }

  resetSession(): MetricsUpdate { // Modified to return MetricsUpdate
    console.log("PlayScreenController: resetSession() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.resetSession(); // Now just call service method and return state
  }

  isRunning(): boolean {
    this.log("isRunning");
    return this.workTimerService.isRunning();
  }

  getElapsedTimeMs(): number {
    this.log("getElapsedTimeMs");
    return this.workTimerService.getElapsedTimeMs();
  }

  getClicks(): number {
    this.log("getClicks");
    return this.workTimerService.getClicks();
  }

  // Modified to accept MetricsUpdate callback
  onMetricsUpdate(callback: (metrics: MetricsUpdate) => void) {
    console.log("PlayScreenController: onMetricsUpdate() setting callback");
    this.metricsUpdateCallback = callback;
  }

  clearMetricsUpdateCallback() {
    console.log("PlayScreenController: clearMetricsUpdateCallback() called");
    this.metricsUpdateCallback = null;
  }
}
