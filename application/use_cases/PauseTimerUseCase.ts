import { UseCase } from './UseCase';

export class PauseTimerUseCase extends UseCase {
  execute(): void {
    this.workSession.pause();
  }
}
