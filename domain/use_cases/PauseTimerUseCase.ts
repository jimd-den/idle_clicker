/**
 * Domain Layer - Use Cases
 *
 * PauseTimerUseCase: Defines the use case for pausing the work timer.
 * It encapsulates the business logic for pausing an active work session.
 *
 * This use case operates on the WorkSession entity and is
 * independent of UI and infrastructure.
 */

import { WorkSession } from '../entities/WorkSession';

export class PauseTimerUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.pause();
  }
}
