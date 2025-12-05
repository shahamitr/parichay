'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface DynamicFieldArrayProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  type?: 'text' | 'url' | 'tel' | 'email';
  maxItems?: number;
  helpText?: string;
}

/**
 * DynamicFieldArray Component
 *
 * Allows users to add/remove multiple values dynamically
 * Used for: phone numbers, videos, images, links, etc.
 */
export default function DynamicFieldArray({
  label,
  values,
  onChange,
  placeholder = 'Enter value',
  type = 'text',
  maxItems,
  helpText,
}: DynamicFieldArrayProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addField = () => {
    if (maxItems && values.length >= maxItems) return;
    onChange([...values, '']);
  };

  const removeField = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const updateField = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newValues = [...values];
    const draggedItem = newValues[draggedIndex];
    newValues.splice(draggedIndex, 1);
    newValues.splice(index, 0, draggedItem);

    onChange(newValues);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const canAddMore = !maxItems || values.length < maxItems;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {maxItems && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({values.length}/{maxItems})
            </span>
          )}
        </label>
        {canAddMore && (
          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </button>
        )}
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}

      <div className="space-y-2">
        {values.length === 0 ? (
          <div className="text-sm text-gray-400 dark:text-gray-500 italic py-4 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            No items added yet. Click "Add" to get started.
          </div>
        ) : (
          values.map((value, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 group ${draggedIndex === index ? 'opacity-50' : ''
                }`}
            >
              <div className="cursor-move text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <GripVertical className="w-4 h-4" />
              </div>
              <input
                type={type}
                value={value}
                onChange={(e) => updateField(index, e.target.value)}
                placeholder={`${placeholder} ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => removeField(index)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
