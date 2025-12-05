'use client';

import { useState, useRef, useEffect } from 'react';
import { GripVertical, Maximize2, Minimize2, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onRemove?: () => void;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export default function DraggableWidget({
  id,
  title,
  children,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = { width: 400, height: 300 },
  onPositionChange,
  onSizeChange,
  onRemove,
  className,
  minWidth = 200,
  minHeight = 150,
  maxWidth = 800,
  maxHeight = 600,
}: DraggableWidgetProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging != null) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setPosition(newPosition);
        onPositionChange?.(newPosition);
      }

      if (isResizing != null) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newSize = {
          width: Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX)),
          height: Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY)),
        };
        setSize(newSize);
        onSizeChange?.(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, minWidth, minHeight, maxWidth, maxHeight, onPositionChange, onSizeChange]);

  // Toggle maximize
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={widgetRef}
      className={cn(
        'absolute bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all',
        isDragging && 'shadow-2xl scale-105 cursor-grabbing',
        isResizing && 'select-none',
        isMaximized && 'inset-4 !w-auto !h-auto',
        className
      )}
      style={
        isMaximized
          ? undefined
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }
      }
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700',
          !isMaximized && 'cursor-grab active:cursor-grabbing'
        )}
        onMouseDown={handleDragStart}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
        <h3 className="flex-1 font-semibold text-gray-900 dark:text-white">{title}</h3>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMaximize}
            className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Remove widget"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-56px)] overflow-auto p-4">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 dark:border-gray-500 group-hover:border-blue-500 transition-colors" />
        </div>
      )}
    </div>
  );
}
