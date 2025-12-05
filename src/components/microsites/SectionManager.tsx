// @ts-nocheck
'use client';

import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MicrositeConfig } from '@/types/microsite';

interface SectionManagerProps {
  config: MicrositeConfig;
  onSectionToggle: (sectionKey: keyof MicrositeConfig['sections']) => void;
  onSectionReorder: (sections: (keyof MicrositeConfig['sections'])[]) => void;
  onEditSection: (sectionKey: keyof MicrositeConfig['sections']) => void;
  onConfigUpdate: (updates: Partial<MicrositeConfig>) => void;
}

interface SectionItemProps {
  id: string;
  section: keyof MicrositeConfig['sections'];
  enabled: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

function SectionItem({ id, section, enabled, onToggle, onEdit }: SectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionLabels: Record<keyof MicrositeConfig['sections'], string> = {
    hero: 'Hero Section',
    about: 'About Section',
    services: 'Services Section',
    gallery: 'Gallery Section',
    contact: 'Contact Section',
  };

  const sectionIcons: Record<keyof MicrositeConfig['sections'], string> = {
    hero: '🎯',
    about: '📖',
    services: '⚙️',
    gallery: '🖼️',
    contact: '📞',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 mb-2 ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      } ${!enabled ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Section Icon and Label */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-2xl">{sectionIcons[section]}</span>
          <span className="font-medium text-gray-900">{sectionLabels[section]}</span>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          aria-label={`Toggle ${sectionLabels[section]}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          disabled={!enabled}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Edit ${sectionLabels[section]}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SectionManager({
  config,
  onSectionToggle,
  onSectionReorder,
  onEditSection,
}: SectionManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sectionKeys = useMemo(
    () => Object.keys(config.sections) as (keyof MicrositeConfig['sections'])[],
    [config.sections]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionKeys.indexOf(active.id as keyof MicrositeConfig['sections']);
      const newIndex = sectionKeys.indexOf(over.id as keyof MicrositeConfig['sections']);

      const newOrder = arrayMove(sectionKeys, oldIndex, newIndex);
      onSectionReorder(newOrder);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Page Sections</h2>
        <p className="text-sm text-gray-600">
          Drag to reorder, toggle to enable/disable, or click edit to customize content.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionKeys} strategy={verticalListSortingStrategy}>
          {sectionKeys.map((sectionKey) => (
            <SectionItem
              key={sectionKey}
              id={sectionKey}
              section={sectionKey}
              enabled={config.sections[sectionKey].enabled}
              onToggle={() => onSectionToggle(sectionKey)}
              onEdit={() => onEditSection(sectionKey)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Drag sections to change their order on the page</li>
              <li>Toggle sections on/off to show or hide them</li>
              <li>Click edit to customize section content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
