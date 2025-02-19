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

  /**
   * Constructor for PlayScreenController.
   * Now accepts a WorkSession instance as a dependency.
   *
   * @param workSession - The WorkSession instance to use.
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


    // Application Layer - WorkTimerService, now receiving Use Cases and TimerService
    this.workTimerService = new WorkTimerService(
      startTimerUseCase,
      pauseTimerUseCase,
      incrementClicksUseCase,
      resetSessionUseCase,
      timerService
    );
      console.log("PlayScreenController: constructor - WorkTimerService created"); // ADDED LOG
      console.log("PlayScreenController: constructor - WorkSession instance:", this.workSessionInstance); // ADDED LOG
  }

  startTimer(): void {
    console.log("PlayScreenController: startTimer() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    this.workTimerService.startTimer();
  }

  pauseTimer(): void {
    console.log("PlayScreenController: pauseTimer() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    this.workTimerService.pauseTimer();
  }

  incrementClicks(): void {
    console.log("PlayScreenController: incrementClicks() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    this.workTimerService.incrementClicks();
  }

  resetSession(): void {
    console.log("PlayScreenController: resetSession() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    this.workTimerService.resetSession();
  }

  isRunning(): boolean {
    console.log("PlayScreenController: isRunning() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    const running = this.workTimerService.isRunning();
    console.log("PlayScreenController: isRunning() returning:", running); // ADDED LOG
    return running;
  }

  getElapsedTimeMs(): number {
    console.log("PlayScreenController: getElapsedTimeMs() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    const elapsed = this.workTimerService.getElapsedTimeMs();
    console.log("PlayScreenController: getElapsedTimeMs() returning:", elapsed); // ADDED LOG
    return elapsed;
  }

  getClicks(): number {
    console.log("PlayScreenController: getClicks() - WorkSession instance:", this.workSessionInstance); // ADDED LOG
    const clicks = this.workTimerService.getClicks();
    console.log("PlayScreenController: getClicks() returning:", clicks); // ADDED LOG
    return clicks;
  }

  onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
    console.log("PlayScreenController: onElapsedTimeUpdate() setting callback"); // ADDED LOG
    this.workTimerService.onElapsedTimeUpdate(callback);
  }

  clearElapsedTimeUpdateCallback() {
    console.log("PlayScreenController: clearElapsedTimeUpdateCallback() called"); // ADDED LOG
    this.workTimerService.clearElapsedTimeUpdateCallback();
  }
}
