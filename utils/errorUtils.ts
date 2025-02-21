export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function setErrorState(setError: (error: string | null) => void, error: unknown): void {
  setError(handleError(error));
}
