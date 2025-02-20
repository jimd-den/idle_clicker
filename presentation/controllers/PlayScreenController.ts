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
  private upmUpdateCallback: ((upm: number) => void) | null = null; // Callback for UPM updates


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

    // Set up elapsed time update callback to also update UPM
    this.workTimerService.onElapsedTimeUpdate((elapsedTimeMs) => {
      console.log("PlayScreenController: onElapsedTimeUpdate - elapsedTimeMs callback triggered:", elapsedTimeMs); // ADDED LOG
      this.updateUPM(); // Recalculate UPM whenever elapsed time updates - **MOVE CALL INSIDE CALLBACK**
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

  incrementClicks(updateClicksUI: (clicks: number) => void): void { // Added callback parameter
    console.log("PlayScreenController: incrementClicks() - WorkSession instance:", this.workSessionInstance);
    this.workTimerService.incrementClicks(); // Now just call service method
    const updatedClicks = this.workTimerService.getClicks();
    updateClicksUI(updatedClicks); // Invoke callback to update UI
    // this.updateUPM(); // Recalculate UPM after click as well - **REMOVE THIS LINE**
  }

  resetSession(): boolean { // Modified to return boolean - although reset always stops timer
    console.log("PlayScreenController: resetSession() - WorkSession instance:", this.workSessionInstance);
    return this.workTimerService.resetSession(); // Now just call service method
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

  onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
    console.log("PlayScreenController: onElapsedTimeUpdate() setting callback");
    this.workTimerService.onElapsedTimeUpdate(callback);
  }

  clearElapsedTimeUpdateCallback() {
    console.log("PlayScreenController: clearElapsedTimeUpdateCallback() called");
    this.workTimerService.clearElapsedTimeUpdateCallback();
  }

  private updateUPM(): void {
    console.log("PlayScreenController: updateUPM() - START"); // ADDED LOG
    const elapsedTimeMs = this.workTimerService.getElapsedTimeMs();
    const clicks = this.workTimerService.getClicks();
    console.log("PlayScreenController: updateUPM() - elapsedTimeMs:", elapsedTimeMs, "clicks:", clicks); // ADDED LOG
    let currentUPM = 0;
    if (elapsedTimeMs > 0) {
      currentUPM = clicks / (elapsedTimeMs / 60000);
    }
    console.log("PlayScreenController: updateUPM() - calculated upm:", currentUPM); // ADDED LOG
    if (this.upmUpdateCallback) {
      this.upmUpdateCallback(currentUPM); // Notify UI about UPM update
      console.log("PlayScreenController: updateUPM() - upmUpdateCallback invoked with:", currentUPM); // ADDED LOG
    } else {
      console.log("PlayScreenController: updateUPM() - upmUpdateCallback is null!"); // ADDED LOG
    }
    console.log("PlayScreenController: updateUPM() - END"); // ADDED LOG
  }

  onUPMUpdate(callback: (upm: number) => void) {
    console.log("PlayScreenController: onUPMUpdate() setting callback");
    this.upmUpdateCallback = callback;
  }

  clearUPMUpdateCallback() {
    console.log("PlayScreenController: clearUPMUpdateCallback() called");
    this.upmUpdateCallback = null;
  }
}
