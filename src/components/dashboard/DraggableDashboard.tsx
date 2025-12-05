'use client';

import { useState } from 'react';
import { GripVertical, Plus, Settings as SettingsIcon, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  removable?: boolean;
}

interface DraggableDashboardProps {
  initialWidgets: Widget[];
  onSave?: (widgets: Widget[]) => void;
}

export default function DraggableDashboard({
  initialWidgets,
  onSave,
}: DraggableDashboardProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetId) return;

    const draggedIndex = widgets.findIndex((w) => w.id === draggedWidget);
    const targetIndex = widgets.findIndex((w) => w.id === targetId);

    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);

    setWidgets(newWidgets);
    setDraggedWidget(null);
  };

  const handleRemove = (widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  };

  const handleSave = () => {
    onSave?.(widgets);
    setIsEditMode(false);
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1 md:col-span-2';
      case 'large':
        return 'col-span-1 md:col-span-2 lg:col-span-3';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div>
      {/* Edit Mode Toggle */}
      <div className="flex justify-end mb-4">
        {isEditMode ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Layout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <SettingsIcon className="w-4 h-4" />
            Customize Dashboard
          </button>
        )}
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, widget.id)}
            className={`${getSizeClass(widget.size)} ${
              isEditMode ? 'cursor-move' : ''
            } ${draggedWidget === widget.id ? 'opacity-50' : ''}`}
          >
            <GlassCard className="h-full">
              {/* Widget Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {isEditMode && (
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {widget.title}
                  </h3>
                </div>
                {isEditMode && widget.removable && (
                  <button
                    onClick={() => handleRemove(widget.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Widget Content */}
              <div className="p-4">{widget.component}</div>
            </GlassCard>
          </div>
        ))}

        {/* Add Widget Button */}
        {isEditMode && (
          <button className="col-span-1 min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Add Widget</span>
          </button>
        )}
      </div>
    </div>
  );
}
