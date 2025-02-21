export function logInfo(message: string, ...optionalParams: any[]): void {
  console.log(`INFO: ${message}`, ...optionalParams);
}

export function logWarning(message: string, ...optionalParams: any[]): void {
  console.warn(`WARNING: ${message}`, ...optionalParams);
}

export function logError(message: string, ...optionalParams: any[]): void {
  console.error(`ERROR: ${message}`, ...optionalParams);
}
