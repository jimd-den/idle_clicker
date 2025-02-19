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
  }

  startTimer(): void {
    this.workTimerService.startTimer();
  }

  pauseTimer(): void {
    this.workTimerService.pauseTimer();
  }

  incrementClicks(): void {
    this.workTimerService.incrementClicks();
  }

  resetSession(): void {
    this.workTimerService.resetSession();
  }

  isRunning(): boolean {
    return this.workTimerService.isRunning();
  }

  getElapsedTimeMs(): number {
    return this.workTimerService.getElapsedTimeMs();
  }

  getClicks(): number {
    return this.workTimerService.getClicks();
  }

  onElapsedTimeUpdate(callback: (elapsedTimeMs: number) => void) {
    this.workTimerService.onElapsedTimeUpdate(callback);
  }

  clearElapsedTimeUpdateCallback() {
    this.workTimerService.clearElapsedTimeUpdateCallback();
  }
}
