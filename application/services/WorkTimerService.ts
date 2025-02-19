/**
 * Application Layer - Services
 *
 * WorkTimerService: Implements the application logic for the work timer.
 * It orchestrates the use cases from the Domain Layer and interacts
 * with the Infrastructure Layer through ports (like TimerService).
 *
 * This service is responsible for managing the work session state
 * and providing methods for the Presentation Layer to interact with
 * the timer functionality.
 */

import { WorkSession } from '@/domain/entities/WorkSession';
import { StartTimerUseCase } from '@/domain/use_cases/StartTimerUseCase';
import { PauseTimerUseCase } from '@/domain/use_cases/PauseTimerUseCase';
import { IncrementClicksUseCase } from '@/domain/use_cases/IncrementClicksUseCase';
import { ResetSessionUseCase } from '@/domain/use_cases/ResetSessionUseCase';
import { TimerService } from '@/application/ports/TimerService';

export class WorkTimerService {
  private workSession: WorkSession; // Now expects WorkSession to be injected
  private startTimerUseCase: StartTimerUseCase;
  private pauseTimerUseCase: PauseTimerUseCase;
  private incrementClicksUseCase: IncrementClicksUseCase;
  private resetSessionUseCase: ResetSessionUseCase;
  private timerService: TimerService;

  /**
   * Constructor for WorkTimerService.
   *
   * Now expects WorkSession instance to be injected as a dependency,
   * along with Use Cases and TimerService.
   *
   * @param workSession - Injected WorkSession instance.
   * @param startTimerUseCase - Use case for starting the timer.
   * @param pauseTimerUseCase - Use case for pausing the timer.
   * @param incrementClicksUseCase - Use case for incrementing clicks.
   * @param resetSessionUseCase - Use case for resetting the session.
   * @param timerService - Infrastructure service for timer operations.
   */
  constructor(
    workSession: WorkSession, // Expect WorkSession instance to be passed in
    startTimerUseCase: StartTimerUseCase,
    pauseTimerUseCase: PauseTimerUseCase,
    incrementClicksUseCase: IncrementClicksUseCase,
    resetSessionUseCase: ResetSessionUseCase,
    timerService: TimerService
  ) {
    this.workSession = workSession; // Use the injected WorkSession instance
    this.startTimerUseCase = startTimerUseCase;
    this.pauseTimerUseCase = pauseTimerUseCase;
    this.incrementClicksUseCase = incrementClicksUseCase;
    this.resetSessionUseCase = resetSessionUseCase;
    this.timerService = timerService;

    console.log("WorkTimerService: constructor - WorkSession instance injected:", this.workSession); // ADDED LOG

    this.timerService.onTimeUpdate((elapsedTimeMs) => {
      // Update elapsed time in WorkSession (if needed in future, for now, UI can track)
      // this.workSession.setElapsedTimeMs(elapsedTimeMs);
      // For now, we just notify listeners in the presentation layer if needed.
      if (this.timeUpdateCallback) {
        this.timeUpdateCallback(elapsedTimeMs);
      }
    });
  }

  private timeUpdateCallback: ((elapsedTimeMs: number) => void) | null = null;

  onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
    this.timeUpdateCallback = callback;
  }

  clearElapsedTimeUpdateCallback() {
    this.timeUpdateCallback = null;
  }

  startTimer(): void {
    console.log("WorkTimerService: startTimer() - WorkSession instance:", this.workSession); // ADDED LOG
    this.startTimerUseCase.execute();
    this.timerService.start();
  }

  pauseTimer(): void {
    console.log("WorkTimerService: pauseTimer() - WorkSession instance:", this.workSession); // ADDED LOG
    this.pauseTimerUseCase.execute();
    this.timerService.pause();
  }

  incrementClicks(): void {
    console.log("WorkTimerService: incrementClicks() - WorkSession instance:", this.workSession); // ADDED LOG
    this.incrementClicksUseCase.execute();
  }

  resetSession(): void {
    console.log("WorkTimerService: resetSession() - WorkSession instance:", this.workSession); // ADDED LOG
    this.resetSessionUseCase.execute();
    this.timerService.pause(); // Pause the timer on reset as well
    this.timerService.clearTimeUpdateCallback(); // Clear any existing time update callbacks
  }

  isRunning(): boolean {
    console.log("WorkTimerService: isRunning() - WorkSession instance:", this.workSession); // ADDED LOG
    return this.workSession.isRunning();
  }

  getElapsedTimeMs(): number {
    console.log("WorkTimerService: getElapsedTimeMs() - WorkSession instance:", this.workSession); // ADDED LOG
    return this.timerService.getElapsedTimeMs();
  }

  getClicks(): number {
    console.log("WorkTimerService: getClicks() - WorkSession instance:", this.workSession); // ADDED LOG
    return this.workSession.getClicks();
  }
}
