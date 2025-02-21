import { UseCase } from './UseCase';

export class ResetSessionUseCase extends UseCase {
  execute(autoStart: boolean = false): void {
    this.workSession.reset(autoStart);
  }
}
