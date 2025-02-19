import { WorkSession } from '@/domain/entities/WorkSession';

export class IncrementClicksUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.recordClick();
  }
}
