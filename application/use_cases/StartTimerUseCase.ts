import { WorkSession } from '@/domain/entities/WorkSession';

export class StartTimerUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.start();
  }
}
