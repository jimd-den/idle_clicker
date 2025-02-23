/**
 * Domain Layer - Use Cases
 *
 * StartTimerUseCase: Defines the use case for starting the work timer.
 */

import { WorkSession } from '../entities/WorkSession';
import { TimeService } from '@/application/ports/TimeService';

export class StartTimerUseCase {
  constructor(
    private readonly workSession: WorkSession,
    private readonly timeService: TimeService
  ) {}

  execute(): void {
    this.workSession.start(this.timeService.getCurrentTime());
  }
}
