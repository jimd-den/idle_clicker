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
  private elapsedTimeUpdateCallback: ((elapsedTimeMs: number) => void) | null = null; // REMOVE separate elapsedTime callback
  private upmUpdateCallback: ((upm: number) => void) | null = null; // REMOVE separate UPM callback
  private isRunningUpdateCallback: ((isRunning: boolean) => void) | null = null; // ADD isRunning callback
  private clicksUpdateCallback: ((clicks: number) => void) | null = null;     // ADD clicks callback


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
      // REMOVE separate callbacks - using combined metrics callback now
      // if (this.elapsedTimeUpdateCallback) {
      //   this.elapsedTimeUpdateCallback(Math.floor(elapsedTimeMs)); // Forward elapsed time update to UI, removing decimal places
      // }
      // if (this.upmUpdateCallback) {
      //   this.upmUpdateCallback(upm); // Forward UPM update to UI
      // }
      // if (this.isRunningUpdateCallback) {
      //   this.isRunningUpdateCallback(isRunning); // Forward isRunning update to UI
      // }
      // if (this.clicksUpdateCallback) {
      //   this.clicksUpdateCallback(clicks); // Forward clicks update to UI
      // }
    });
  }

  startTimer(): boolean { // Modified to return boolean
    console.log("PlayScreenController: startTimer() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.startTimer(); // Now just call service method
  }

  pauseTimer(): boolean { // Modified to return boolean
    console.log("PlayScreenController: pauseTimer() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.pauseTimer(); // Now just call service method
  }

  incrementClicks(updateClicksUI: (clicks: number) => void): void { // Added callback parameter - but not really needed anymore
    console.log("PlayScreenController: incrementClicks() - WorkSession instance:", this.workSessionInstance);
    this.workTimerService.incrementClicks(); // Now just call service method
    const updatedClicks = this.workTimerService.getClicks(); // Get clicks directly from service
    updateClicksUI(updatedClicks); // Invoke callback to update UI - still useful for immediate click update
  }

  resetSession(): MetricsUpdate { // Modified to return MetricsUpdate
    console.log("PlayScreenController: resetSession() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.resetSession(); // Now just call service method and return state
  }

  isRunning(): boolean {
    console.log("PlayScreenController: isRunning() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.isRunning();
  }

  getElapsedTimeMs(): number {
    console.log("PlayScreenController: getElapsedTimeMs() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.getElapsedTimeMs();
  }

  getClicks(): number {
    console.log("PlayScreenController: getClicks() - WorkSession instance:", this.workSessionInstance);
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

  // REMOVE separate callbacks - using combined metrics callback now
  // onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
  //   console.log("PlayScreenController: onElapsedTimeUpdate() setting callback");
  //   this.elapsedTimeUpdateCallback = callback;
  // }

  // clearElapsedTimeUpdateCallback() {
  //   console.log("PlayScreenController: clearElapsedTimeUpdateCallback() called");
  //   this.elapsedTimeUpdateCallback = null;
  // }

  // onUPMUpdate(callback: (upm: number) => void) {
  //   console.log("PlayScreenController: onUPMUpdate() setting callback");
  //   this.upmUpdateCallback = callback;
  // }

  // clearUPMUpdateCallback() {
  //   console.log("PlayScreenController: clearUPMUpdateCallback() called");
  //   this.upmUpdateCallback = null;
  // }

  // onIsRunningUpdate(callback: (isRunning: boolean) => void) {
  //   console.log("PlayScreenController: onIsRunningUpdate() setting callback");
  //   this.isRunningUpdateCallback = callback;
  // }

  // clearIsRunningUpdateCallback() {
  //   console.log("PlayScreenController: clearIsRunningUpdateCallback() called");
  //   this.isRunningUpdateCallback = null;
  // }

  // onClicksUpdate(callback: (clicks: number) => void) {
  //   console.log("PlayScreenController: onClicksUpdate() setting callback");
  //   this.clicksUpdateCallback = callback;
  // }

  // clearClicksUpdateCallback() {
  //   console.log("PlayScreenController: clearClicksUpdateCallback() called");
  //   this.clicksUpdateCallback = null;
  // }
}
