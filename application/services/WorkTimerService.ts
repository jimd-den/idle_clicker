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
  private workSession: WorkSession;
  private startTimerUseCase: StartTimerUseCase;
  private pauseTimerUseCase: PauseTimerUseCase;
  private incrementClicksUseCase: IncrementClicksUseCase;
  private resetSessionUseCase: ResetSessionUseCase;
  private timerService: TimerService;

  constructor(timerService: TimerService) {
    this.workSession = new WorkSession();
    this.startTimerUseCase = new StartTimerUseCase(this.workSession);
    this.pauseTimerUseCase = new PauseTimerUseCase(this.workSession);
    this.incrementClicksUseCase = new IncrementClicksUseCase(this.workSession);
    this.resetSessionUseCase = new ResetSessionUseCase(this.workSession);
    this.timerService = timerService;

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
    this.startTimerUseCase.execute();
    this.timerService.start();
  }

  pauseTimer(): void {
    this.pauseTimerUseCase.execute();
    this.timerService.pause();
  }

  incrementClicks(): void {
    this.incrementClicksUseCase.execute();
  }

  resetSession(): void {
    this.resetSessionUseCase.execute();
    this.timerService.pause(); // Pause the timer on reset as well
    this.timerService.clearTimeUpdateCallback(); // Clear any existing time update callbacks
  }

  isRunning(): boolean {
    return this.workSession.isRunning();
  }

  getElapsedTimeMs(): number {
    return this.timerService.getElapsedTimeMs();
  }

  getClicks(): number {
    return this.workSession.getClicks();
  }
}
