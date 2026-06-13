/**
 * Error Message Utilities
 * Helpers for converting raw fetch/network errors into user-friendly messages.
 */

export const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.';
export const NETWORK_ERROR_MESSAGE = 'Unable to connect to the server. Please check your internet connection and try again.';

/**
 * isNetworkError - Detects whether an error was caused by a failed network request
 * rather than an application-level error (fetch throws a TypeError when the
 * network request itself fails, e.g. the server is unreachable).
 * @param {Error} error - The error to inspect
 * @returns {boolean} True if the error looks like a connectivity failure
 */
export function isNetworkError(error) {
  return error instanceof TypeError;
}

/**
 * getFetchErrorMessage - Converts an error from a fetch call into a user-friendly message
 * @param {Error} error - The error thrown while fetching
 * @param {string} fallbackMessage - Friendly message to use when the error isn't a network error
 * @returns {string} A user-friendly error message
 */
export function getFetchErrorMessage(error, fallbackMessage) {
  return isNetworkError(error) ? NETWORK_ERROR_MESSAGE : fallbackMessage;
}
