/**
 * Todo Validation Utilities
 * Helper functions for validating todo data.
 */

/**
 * isValidTodoTitle - Validates that a todo title is not empty or whitespace-only
 * @param {string} title - The title to validate
 * @returns {boolean} True if title is valid (not empty), false otherwise
 */
export function isValidTodoTitle(title) {
  return title.trim() !== '';
}