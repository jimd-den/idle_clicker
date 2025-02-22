/**
 * Domain Layer - Use Cases
 *
 * ResetSessionUseCase: Defines the use case for resetting the work session.
 */

import { WorkSession } from '../entities/WorkSession';
import { TimeService } from '@/application/ports/TimeService';

export class ResetSessionUseCase {
  constructor(
    private readonly workSession: WorkSession,
    private readonly timeService: TimeService
  ) {}

  execute(autoStart: boolean = false): void {
    if (autoStart) {
      this.workSession.reset(this.timeService.getCurrentTime());
    } else {
      this.workSession.reset();
    }
  }
}
