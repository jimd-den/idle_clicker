import { WorkSession } from '@/domain/entities/WorkSession';

export class ResetSessionUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.reset();
  }
}
