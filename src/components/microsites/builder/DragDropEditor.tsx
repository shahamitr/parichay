// @ts-nocheck
'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { SectionOrderItem, SectionId } from '@/types/microsite';

interface DragDropEditorProps {
  sections: SectionOrderItem[];
  onSectionsChange: (sections: SectionOrderItem[]) => void;
  onEditSection: (sectionId: SectionId) => void;
  onDeleteSection?: (sectionId: SectionId) => void;
  onDuplicateSection?: (sectionId: SectionId) => void;
}

const sectionLabels: Record<SectionId, { label: string; icon: string; description: string }> = {
  hero: { label: 'Hero Banner', icon: '🎯', description: 'Main banner with title and CTA' },
  about: { label: 'About Us', icon: '📝', description: 'Business description' },
  services: { label: 'Services', icon: '🛠️', description: 'List of services offered' },
  gallery: { label: 'Gallery', icon: '🖼️', description: 'Photo gallery' },
  contact: { label: 'Contact', icon: '📞', description: 'Contact form and info' },
  payment: { label: 'Payment', icon: '💳', description: 'Payment methods' },
  feedback: { label: 'Feedback', icon: '⭐', description: 'Customer feedback form' },
  trustIndicators: { label: 'Trust Badges', icon: '🏆', description: 'Certifications & awards' },
  videos: { label: 'Videos', icon: '🎬', description: 'Video content' },
  testimonials: { label: 'Testimonials', icon: '💬', description: 'Customer reviews' },
  impact: { label: 'Impact Stats', icon: '📊', description: 'Numbers and achievements' },
  portfolio: { label: 'Portfolio', icon: '📁', description: 'Work showcase' },
  aboutFounder: { label: 'About Founder', icon: '👤', description: 'Founder information' },
  offers: { label: 'Offers', icon: '🏷️', description: 'Special deals' },
  cta: { label: 'Call to Action', icon: '🚀', description: 'Action buttons' },
  businessHours: { label: 'Business Hours', icon: '🕐', description: 'Operating hours' },
};

function SortableSection({
  section,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  section: SectionOrderItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const info = sectionLabels[section.id] || { label: section.id, icon: '📄', description: '' };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white border rounded-lg mb-2 transition-all ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'shadow-sm hover:shadow-md'
      } ${!section.enabled ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center p-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 mr-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Section Icon */}
        <span className="text-xl mr-3">{info.icon}</span>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{info.label}</p>
          <p className="text-xs text-gray-500 truncate">{info.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit section"
          >
            <Settings className="w-4 h-4" />
          </button>
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
              title="Duplicate section"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toggle Visibility */}
        <button
          onClick={onToggle}
          className={`ml-2 p-1.5 rounded transition-colors ${
            section.enabled
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={section.enabled ? 'Hide section' : 'Show section'}
        >
          {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function DragOverlayContent({ section }: { section: SectionOrderItem }) {
  const info = sectionLabels[section.id] || { label: section.id, icon: '📄', description: '' };

  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg shadow-xl p-3 flex items-center">
      <GripVertical className="w-5 h-5 text-gray-400 mr-2" />
      <span className="text-xl mr-3">{info.icon}</span>
      <p className="font-medium text-gray-900">{info.label}</p>
    </div>
  );
}

export default function DragDropEditor({
  sections,
  onSectionsChange,
  onEditSection,
  onDeleteSection,
  onDuplicateSection,
}: DragDropEditorProps) {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as SectionId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onSectionsChange(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const handleToggle = (sectionId: SectionId) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Page Sections</h3>
        <p className="text-xs text-gray-500">Drag to reorder, click eye to show/hide</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onToggle={() => handleToggle(section.id)}
              onEdit={() => onEditSection(section.id)}
              onDelete={onDeleteSection ? () => onDeleteSection(section.id) : undefined}
              onDuplicate={onDuplicateSection ? () => onDuplicateSection(section.id) : undefined}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeSection ? <DragOverlayContent section={activeSection} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
        <div className="flex gap-2">
          <button
            onClick={() => onSectionsChange(sections.map((s) => ({ ...s, enabled: true })))}
            className="flex-1 px-3 py-2 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
          >
            Show All
          </button>
          <button
            onClick={() => onSectionsChange(sections.map((s) => ({ ...s, enabled: false })))}
            className="flex-1 px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
          >
            Hide All
          </button>
        </div>
      </div>
    </div>
  );
}
