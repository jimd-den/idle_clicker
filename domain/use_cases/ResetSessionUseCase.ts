/**
 * Domain Layer - Use Cases
 *
 * ResetSessionUseCase: Defines the use case for resetting the work session.
 * It encapsulates the business logic for starting a new work session,
 * clearing all previous data.
 *
 * This use case operates on the WorkSession entity and is
 * independent of UI and infrastructure.
 */

import { WorkSession } from '../entities/WorkSession';

export class ResetSessionUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.reset();
  }
}
