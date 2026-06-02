/**
 * Todo Reducer
 * Centralized state management for all todo-related state.
 * Manages: todoList, error, filterError, isTodoListLoading, 
 * sortBy, sortDirection, filterTerm, dataVersion
 */

// ========================================
// ACTION TYPES
// ========================================
export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  // Add todo operations
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  // Update todo operations
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // Complete todo operations
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  // UI operations
  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',
  INVALIDATE_CACHE: 'INVALIDATE_CACHE',
};

// ========================================
// INITIAL STATE
// ========================================
export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'creationDate',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

// ========================================
// REDUCER FUNCTION
// ========================================
export function todoReducer(state, action) {
  switch (action.type) {
    // ========== FETCH OPERATIONS ==========
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload.tasks ?? [],
        isTodoListLoading: false,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_ERROR:
      // Determine if this is a filter/sort error or a general error
      const isFilterError =
        action.payload.isFilterError ?? false;
      return {
        ...state,
        isTodoListLoading: false,
        ...(isFilterError
          ? { filterError: action.payload.message }
          : { error: action.payload.message }),
      };

    // ========== ADD TODO OPERATIONS ==========
    case TODO_ACTIONS.ADD_TODO_START:
      // Optimistically add the new todo to the list
      return {
        ...state,
        todoList: [action.payload, ...state.todoList],
        error: '',
      };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      // Replace the optimistic todo (with temporary ID) with server response
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.tempId
            ? action.payload.newTodo
            : todo
        ),
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.ADD_TODO_ERROR:
      // Remove the optimistic todo if the request failed
      return {
        ...state,
        todoList: state.todoList.filter(
          todo => todo.id !== action.payload.tempId
        ),
        error: action.payload.message,
      };

    // ========== UPDATE TODO OPERATIONS ==========
    case TODO_ACTIONS.UPDATE_TODO_START:
      // Optimistically update the todo
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.editedTodo.id
            ? action.payload.editedTodo
            : todo
        ),
        error: '',
      };

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      // Update succeeded; increment dataVersion to invalidate cache
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      // Revert to original state
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.originalTodo.id
            ? action.payload.originalTodo
            : todo
        ),
        error: action.payload.message,
      };

    // ========== COMPLETE TODO OPERATIONS ==========
    case TODO_ACTIONS.COMPLETE_TODO_START:
      // Optimistically mark as complete
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, isCompleted: true }
            : todo
        ),
        error: '',
      };

    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      // Update succeeded; increment dataVersion to invalidate cache
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      // Revert to original state
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.originalTodo.id
            ? action.payload.originalTodo
            : todo
        ),
        error: action.payload.message,
      };

    // ========== UI OPERATIONS ==========
    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload,
      };

    case TODO_ACTIONS.CLEAR_ERROR:
      // Clear the appropriate error type
      const errorType = action.payload.type ?? 'general';
      return {
        ...state,
        ...(errorType === 'filter'
          ? { filterError: '' }
          : { error: '' }),
      };

    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'creationDate',
        sortDirection: 'desc',
        filterError: '',
      };

    case TODO_ACTIONS.INVALIDATE_CACHE:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
