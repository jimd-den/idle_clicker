import { UseCase } from './UseCase';

export class StartTimerUseCase extends UseCase {
  execute(): void {
    this.workSession.start();
  }
}
