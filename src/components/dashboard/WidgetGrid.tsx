'use client';

import { useState, useEffect } from 'react';
import DraggableWidget from './DraggableWidget';
import { Plus, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WidgetGridProps {
  initialWidgets?: Widget[];
  onWidgetsChange?: (widgets: Widget[]) => void;
}

export default function WidgetGrid({ initialWidgets = [], onWidgetsChange }: WidgetGridProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Save to localStorage
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
      onWidgetsChange?.(widgets);
    }
  }, [widgets, onWidgetsChange]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    if (saved != null) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load widgets:', e);
      }
    }
  }, []);

  const updateWidgetPosition = (id: string, position: { x: number; y: number }) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  };

  const updateWidgetSize = (id: string, size: { width: number; height: number }) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const addWidget = (widget: Omit<Widget, 'id'>) => {
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
    };
    setWidgets((prev) => [...prev, newWidget]);
    setShowAddMenu(false);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Add Widget Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Widget
        </button>

        {/* Add Widget Menu */}
        {showAddMenu && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-2">
              <button
                onClick={() =>
                  addWidget({
                    title: 'Analytics',
                    component: <div className="text-center py-8">Analytics Widget</div>,
                    position: { x: 20, y: 20 },
                    size: { width: 400, height: 300 },
                  })
                }
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Analytics Widget
              </button>
              <button
                onClick={() =>
                  addWidget({
                    title: 'Recent Activity',
                    component: <div className="text-center py-8">Activity Widget</div>,
                    position: { x: 440, y: 20 },
                    size: { width: 400, height: 300 },
                  })
                }
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Recent Activity
              </button>
              <button
                onClick={() =>
                  addWidget({
                    title: 'Quick Stats',
                    component: <div className="text-center py-8">Stats Widget</div>,
                    position: { x: 20, y: 340 },
                    size: { width: 400, height: 300 },
                  })
                }
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Quick Stats
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Widgets */}
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-gray-500 dark:text-gray-400">
          <LayoutGrid className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No widgets added yet</p>
          <p className="text-sm">Click "Add Widget" to get started</p>
        </div>
      ) : (
        widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            id={widget.id}
            title={widget.title}
            defaultPosition={widget.position}
            defaultSize={widget.size}
            onPositionChange={(pos) => updateWidgetPosition(widget.id, pos)}
            onSizeChange={(size) => updateWidgetSize(widget.id, size)}
            onRemove={() => removeWidget(widget.id)}
          >
            {widget.component}
          </DraggableWidget>
        ))
      )}
    </div>
  );
}
