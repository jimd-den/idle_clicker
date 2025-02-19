/**
 * Domain Layer - Use Cases
 *
 * StartTimerUseCase: Defines the use case for starting the work timer.
 * It encapsulates the business logic for initiating a work session.
 *
 * This use case operates on the WorkSession entity and is
 * independent of UI and infrastructure.
 */

import { WorkSession } from '../entities/WorkSession';

export class StartTimerUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.start();
  }
}
