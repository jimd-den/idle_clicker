import { WorkSession } from '@/domain/entities/WorkSession';

export class PauseTimerUseCase {
  constructor(private workSession: WorkSession) {}

  execute(): void {
    this.workSession.pause();
  }
}
