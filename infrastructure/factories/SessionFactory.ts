/**
 * Infrastructure Layer - Factories
 */

import { SessionService } from '@/application/services/SessionService';
import { AsyncStorageService } from '../services/AsyncStorageService';
import { TimeServiceImpl } from '../services/TimeServiceImpl';

export class SessionFactory {
  createSessionService() {
    const storageService = new AsyncStorageService();
    const timeService = new TimeServiceImpl();
    return new SessionService(storageService, timeService);
  }
}