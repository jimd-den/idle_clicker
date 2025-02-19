/**
 * Domain Layer - Use Cases
 *
 * IncrementClicksUseCase: Defines the use case for incrementing the click count.
 * It encapsulates the business logic for recording a work unit (click).
 *
 * This use case operates on the WorkSession entity and is
 * independent of UI and infrastructure.
 */

import { WorkSession } from '../entities/WorkSession';

export class IncrementClicksUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.recordClick();
  }
}
