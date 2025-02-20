import { UseCase } from './UseCase';

export class IncrementClicksUseCase extends UseCase {
  execute(): void {
    this.workSession.recordClick();
  }
}
