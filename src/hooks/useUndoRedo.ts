import { useState, useCallback } from 'react';

interface UseUndoRedoOptions<T> {
  initialState: T;
  maxHistory?: number;
}

export function useUndoRedo<T>({ initialState, maxHistory = 50 }: UseUndoRedoOptions<T>) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const setState = useCallback((newState: T) => {
    setHistory((prev) => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      // Add new state
      newHistory.push(newState);
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        setCurrentIndex(currentIndex);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
      return newHistory;
    });
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (canUndo != null) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo != null) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
