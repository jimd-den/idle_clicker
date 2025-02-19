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
import { TimerServiceImpl } from '@/infrastructure/TimerServiceImpl'; // Import the infrastructure implementation

export class PlayScreenController {
  private workTimerService: WorkTimerService;

  constructor() {
    // In a real app, you might use Dependency Injection to provide TimerServiceImpl
    this.workTimerService = new WorkTimerService(new TimerServiceImpl());
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
