import { UseCase } from './UseCase';

export class ResetSessionUseCase extends UseCase {
  execute(): void {
    this.workSession.reset();
  }
}
