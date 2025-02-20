/**
 * Utils - timeUtils
 *
 * Utility functions for time formatting and conversion.
 */

/**
 * Formats milliseconds into a human-readable time string (MM:SS).
 *
 * @param {number} milliseconds - The time in milliseconds.
 * @returns {string} Formatted time string in MM:SS format.
 */
export function formatTime(milliseconds: number): string {
  if (isNaN(milliseconds) || milliseconds < 0) {
    return "00:00"; // Return "00:00" for invalid input
  }

  // Calculate total seconds, rounding down to whole seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${mm}:${ss}`;
}
