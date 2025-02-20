import { WorkSession } from '@/domain/entities/WorkSession';

export abstract class UseCase {
  protected workSession: WorkSession;

  constructor(workSession: WorkSession) {
    this.workSession = workSession;
  }

  abstract execute(): void;
}
