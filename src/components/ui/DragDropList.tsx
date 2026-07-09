'use client';

import { useState, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DragDropListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
}

interface DragHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  className: string;
  'aria-label': string;
}

export function DragDropList<T>({ items, onReorder, renderItem, keyExtractor, className }: DragDropListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, moved);
    onReorder(newItems);
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, items, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => {
        const dragHandleProps: DragHandleProps = {
          onMouseDown: () => handleDragStart(index),
          onTouchStart: () => handleDragStart(index),
          className: 'cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 rounded touch-none',
          'aria-label': `Drag to reorder item ${index + 1}`,
        };

        return (
          <div
            key={keyExtractor(item)}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'transition-all duration-150',
              dragIndex === index && 'opacity-50 scale-[0.98]',
              dragOverIndex === index && dragIndex !== index && 'border-t-2 border-indigo-400',
            )}
          >
            {renderItem(item, index, dragHandleProps)}
          </div>
        );
      })}
    </div>
  );
}

/** Pre-built drag handle icon */
export function DragHandle(props: DragHandleProps) {
  return (
    <button type="button" {...props}>
      <GripVertical className="w-4 h-4" />
    </button>
  );
}
