import { useState } from 'react';

/** 
 * Custom hook to manage the state of an editable title.
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