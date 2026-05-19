import { useState } from 'react';

/**
 * useEditableTitle Hook
 * Custom React hook for managing editable title state.
 * Tracks editing mode, working title value, and provides functions to modify state.
 */

/**
 * useEditableTitle - Manages state for editable text input
 * @param {string} initialTitle - The initial/default title value
 * @returns {Object} Hook state and functions
 * @returns {boolean} isEditing - Whether the title is currently being edited
 * @returns {string} workingTitle - The current editable title value
 * @returns {Function} startEditing - Enter edit mode
 * @returns {Function} cancelEdit - Cancel editing and reset to initial value
 * @returns {Function} updateTitle - Update the working title value
 * @returns {Function} finishEdit - Exit edit mode and return the final title
 */
export function useEditableTitle(initialTitle) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(initialTitle);

  const startEditing = () => {
    setWorkingTitle(initialTitle);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setWorkingTitle(initialTitle);
    setIsEditing(false);
  };

  const updateTitle = (newTitle) => {
    setWorkingTitle(newTitle);
  };

  const finishEdit = () => {
    setIsEditing(false);
    return workingTitle;
  };

  return {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit
  };
}