/**
 * Infrastructure Layer - Implementations
 * Implements the StorageService port using React Native's AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '@/application/ports/StorageService';

export class AsyncStorageService implements StorageService {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}