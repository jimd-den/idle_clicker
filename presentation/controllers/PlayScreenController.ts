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

import { WorkTimerService } from '@/application/services/WorkTimerService';
import { TimerServiceImpl } from '@/infrastructure/TimerServiceImpl';
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { WorkSession } from '@/domain/entities/WorkSession';

export class PlayScreenController {
  private workTimerService: WorkTimerService;
  private workSessionInstance: WorkSession; // Keep track of WorkSession instance
  private upmUpdateCallback: ((upm: number) => void) | null = null; // Callback for UPM updates


  /**
   * Constructor for PlayScreenController.
   * Now accepts a WorkSession instance as a dependency, which is then
   * passed down to the WorkTimerService.
   *
   * @param workSession - Injected WorkSession instance from Presentation Layer.
   */
  constructor(workSession: WorkSession) { // Modified constructor to accept WorkSession
    // Infrastructure Layer dependency
    const timerService = new TimerServiceImpl();
    this.workSessionInstance = workSession; // Use the injected WorkSession instance

    // Use Cases - Domain Layer logic, now instantiated with the injected WorkSession
    const startTimerUseCase = new StartTimerUseCase(workSession);
    const pauseTimerUseCase = new PauseTimerUseCase(workSession);
    const incrementClicksUseCase = new IncrementClicksUseCase(workSession);
    const resetSessionUseCase = new ResetSessionUseCase(workSession);


    // Application Layer - WorkTimerService, now receiving Use Cases, TimerService, and WorkSession
    this.workTimerService = new WorkTimerService(
      workSession, // Pass the injected WorkSession instance to WorkTimerService
      startTimerUseCase,
      pauseTimerUseCase,
      incrementClicksUseCase,
      resetSessionUseCase,
      timerService
    );
    console.log("PlayScreenController: constructor - WorkTimerService created");
    console.log("PlayScreenController: constructor - WorkSession instance:", this.workSessionInstance);

    // Set up elapsed time update callback to also update UPM
    this.workTimerService.onElapsedTimeUpdate((elapsedTimeMs) => {
      this.updateUPM(); // Recalculate UPM whenever elapsed time updates
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
    this.updateUPM();
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
    const elapsedTimeMs = this.workTimerService.getElapsedTimeMs();
    const clicks = this.workTimerService.getClicks();
    let currentUPM = 0;
    if (elapsedTimeMs > 0) {
      currentUPM = clicks / (elapsedTimeMs / 60000);
    }
    console.log("PlayScreenController: updateUPM() - elapsedTimeMs:", elapsedTimeMs, "clicks:", clicks, "upm:", currentUPM);
    if (this.upmUpdateCallback) {
      this.upmUpdateCallback(currentUPM); // Notify UI about UPM update
    }
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
