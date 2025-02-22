/**
 * Application Layer - Ports
 * 
 * StorageService: Defines a port for persistent storage operations.
 * This abstracts away the concrete implementation of how data is stored.
 */

export interface StorageService {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}