// @ts-nocheck
'use client';

import { useState } from 'react';
import { History, Undo2, Redo2, Clock, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface HistoryEntry {
  id: number;
  timestamp: Date;
  action: string;
  description: string;
  state: any;
}

interface UndoHistoryPanelProps {
  history: HistoryEntry[];
Index: number;
  onJumpToState: (index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Action type to human-readable description
function getActionDescription(action: string, state: any): string {
  const actionMap: Record<string, string> = {
    'section.toggle': 'Toggled section visibility',
    'section.reorder': 'Reordered sections',
    'section.update': 'Updated section content',
    'theme.change': 'Changed color theme',
    'font.change': 'Changed typography',
    'template.change': 'Changed template',
    'seo.update': 'Updated SEO settings',
    'config.update': 'Updated configuration',
  };

  return actionMap[action] || 'Made changes';
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function UndoHistoryPanel({
  history,
  currentIndex,
  onJumpToState,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: UndoHistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t bg-gray-50">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">History</span>
          <span className="text-xs text-gray-400">
            ({history.length} {history.length === 1 ? 'change' : 'changes'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick Undo/Redo */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
            disabled={!canUndo}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRedo();
            }}
            disabled={!canRedo}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* History List */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto border-t">
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No history yet</p>
              <p className="text-xs text-gray-400">Changes will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {history.map((entry, index) => {
                const isCurrent = index === currentIndex;
                const isFuture = index > currentIndex;

                return (
                  <button
                    key={entry.id}
                    onClick={() => onJumpToState(index)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 border-l-2 border-blue-500'
                        : isFuture
                        ? 'bg-gray-100 opacity-60'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="relative">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isCurrent
                            ? 'bg-blue-500'
                            : isFuture
                            ? 'bg-gray-300'
                            : 'bg-gray-400'
                        }`}
                      />
                      {index < history.length - 1 && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-200" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {entry.description}
                      </p>
                      <p className="text-xs text-gray-400">{formatTime(entry.timestamp)}</p>
                    </div>

                    {/* Current indicator */}
                    {isCurrent && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-2 border-t bg-gray-100">
              <button
                onClick={() => onJumpToState(0)}
                className="w-full px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to initial state
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for managing history with descriptions
export interface HistoryState<T> {
  state: T;
  action: string;
  description: string;
}

export function useHistoryWithDescriptions<T>(initialState: T, maxHistory: number = 50) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      timestamp: new Date(),
      action: 'initial',
      description: 'Initial state',
      state: initialState,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex]?.state ?? initialState;

  const pushState = (newState: T, action: string, description: string) => {
    setHistory((prev) => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);

      // Add new state
      newHistory.push({
        id: Date.now(),
        timestamp: new Date(),
        action,
        description,
        state: newState,
      });

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }

      return newHistory;
    });

    setCurrentIndex((prev) => Math.min(prev + 1, maxHistory - 1));
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const jumpToState = (index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
    }
  };

  return {
    state: currentState,
    history,
    currentIndex,
    pushState,
    undo,
    redo,
    jumpToState,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
