/**
 * Domain Layer - Use Cases
 *
 * PauseTimerUseCase: Defines the use case for pausing the work timer.
 */

import { WorkSession } from '../entities/WorkSession';
import { TimeService } from '@/application/ports/TimeService';

export class PauseTimerUseCase {
  constructor(
    private readonly workSession: WorkSession,
    private readonly timeService: TimeService
  ) {}

  execute(): void {
    this.workSession.pause(this.timeService.getCurrentTime());
  }
}
