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

  constructor() {
    // Infrastructure Layer dependency
    const timerService = new TimerServiceImpl();
    // Domain Layer dependency (WorkSession entity)
    const workSession = new WorkSession();

    // Use Cases - Domain Layer logic, now instantiated here and passed to service
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
  }

  startTimer(): void {
    console.log("PlayScreenController: startTimer() called"); // ADDED LOG
    this.workTimerService.startTimer();
  }

  pauseTimer(): void {
    console.log("PlayScreenController: pauseTimer() called"); // ADDED LOG
    this.workTimerService.pauseTimer();
  }

  incrementClicks(): void {
    console.log("PlayScreenController: incrementClicks() called"); // ADDED LOG
    this.workTimerService.incrementClicks();
  }

  resetSession(): void {
    console.log("PlayScreenController: resetSession() called"); // ADDED LOG
    this.workTimerService.resetSession();
  }

  isRunning(): boolean {
    const running = this.workTimerService.isRunning();
    console.log("PlayScreenController: isRunning() returning:", running); // ADDED LOG
    return running;
  }

  getElapsedTimeMs(): number {
    const elapsed = this.workTimerService.getElapsedTimeMs();
    console.log("PlayScreenController: getElapsedTimeMs() returning:", elapsed); // ADDED LOG
    return elapsed;
  }

  getClicks(): number {
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
