'use client';

import { useState } from 'react';
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
  Home,
  Info,
  ShoppingBag,
  Image as ImageIcon,
  Video,
  Phone,
  CreditCard,
  TrendingUp,
  Star,
  Megaphone,
  Award,
  Users,
  Clock,
  Gift,
  HelpCircle,
  Briefcase,
  MessageSquare,
  Mic,
  MessageCircle,
  Sparkles,
  Calendar,
  MapPin,
  MessageCircleReply,
} from 'lucide-react';
import { SectionOrderItem, SectionId } from '@/types/microsite';

interface SectionSidebarProps {
  sections: SectionOrderItem[];
  onSectionsChange: (sections: SectionOrderItem[]) => void;
  activeSection: string | null;
  onSectionClick: (sectionId: SectionId) => void;
}

const sectionMetadata: Record<SectionId, { label: string; icon: React.ReactNode }> = {
  hero: { label: 'Hero', icon: <Megaphone className="w-3.5 h-3.5" /> },
  about: { label: 'About', icon: <Info className="w-3.5 h-3.5" /> },
  services: { label: 'Services', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  priceList: { label: 'Prices', icon: <CreditCard className="w-3.5 h-3.5" /> },
  gallery: { label: 'Gallery', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  contact: { label: 'Contact', icon: <Phone className="w-3.5 h-3.5" /> },
  payment: { label: 'Payment', icon: <CreditCard className="w-3.5 h-3.5" /> },
  feedback: { label: 'Feedback', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  trustIndicators: { label: 'Trust', icon: <Award className="w-3.5 h-3.5" /> },
  videos: { label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
  testimonials: { label: 'Reviews', icon: <Star className="w-3.5 h-3.5" /> },
  impact: { label: 'Stats', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  portfolio: { label: 'Portfolio', icon: <Briefcase className="w-3.5 h-3.5" /> },
  aboutFounder: { label: 'Founder', icon: <Users className="w-3.5 h-3.5" /> },
  offers: { label: 'Offers', icon: <Gift className="w-3.5 h-3.5" /> },
  cta: { label: 'CTA', icon: <Megaphone className="w-3.5 h-3.5" /> },
  businessHours: { label: 'Hours', icon: <Clock className="w-3.5 h-3.5" /> },
  faq: { label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  team: { label: 'Team', icon: <Users className="w-3.5 h-3.5" /> },
  booking: { label: 'Booking', icon: <Calendar className="w-3.5 h-3.5" /> },
  localSEO: { label: 'Local SEO', icon: <MapPin className="w-3.5 h-3.5" /> },
  messaging: { label: 'Messaging', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  reviewResponse: { label: 'Reviews', icon: <MessageCircleReply className="w-3.5 h-3.5" /> },
  videoTestimonials: { label: 'Video Reviews', icon: <Video className="w-3.5 h-3.5" /> },
  voiceIntro: { label: 'Voice', icon: <Mic className="w-3.5 h-3.5" /> },
  whatsappCatalogue: { label: 'Catalogue', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  socialProofBadges: { label: 'Badges', icon: <Award className="w-3.5 h-3.5" /> },
};

const premiumFeatureIds: SectionId[] = [
  'videoTestimonials',
  'voiceIntro',
  'whatsappCatalogue',
  'socialProofBadges',
];

function SortableSection({
  section,
  isActive,
  onToggle,
  onClick,
  isPremium,
}: {
  section: SectionOrderItem;
  isActive: boolean;
  onToggle: () => void;
  onClick: () => void;
  isPremium?: boolean;
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

  const info = sectionMetadata[section.id] || {
    label: section.id,
    icon: <Home className="w-3.5 h-3.5" />,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1.5 px-1.5 py-1 rounded transition-all cursor-pointer ${
        isDragging ? 'ring-1 ring-amber-500 bg-gray-800' : ''
      } ${isActive ? 'bg-amber-500/15 border border-amber-500/30' : 'hover:bg-gray-800/50'} ${
        !section.enabled ? 'opacity-40' : ''
      } ${isPremium ? 'border-l-2 border-l-purple-500/50' : ''}`}
      onClick={onClick}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-0.5 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3 h-3" />
      </button>

      <div className={`${isActive ? 'text-amber-500' : isPremium ? 'text-purple-400' : 'text-gray-500'}`}>
        {info.icon}
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-1">
        <span className={`text-xs font-medium truncate ${isActive ? 'text-amber-500' : 'text-gray-300'}`}>
          {info.label}
        </span>
        {isPremium && <Sparkles className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" />}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`p-0.5 rounded transition-colors ${
          section.enabled ? 'text-emerald-500' : 'text-gray-600'
        }`}
        title={section.enabled ? 'Hide' : 'Show'}
      >
        {section.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      </button>
    </div>
  );
}

function DragOverlayContent({ section }: { section: SectionOrderItem }) {
  const info = sectionMetadata[section.id] || {
    label: section.id,
    icon: <Home className="w-3.5 h-3.5" />,
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 border border-amber-500 rounded shadow-xl">
      <GripVertical className="w-3 h-3 text-gray-400" />
      <div className="text-amber-500">{info.icon}</div>
      <span className="text-xs font-medium text-white">{info.label}</span>
    </div>
  );
}

export default function SectionSidebar({
  sections,
  onSectionsChange,
  activeSection,
  onSectionClick,
}: SectionSidebarProps) {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
      sections.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const activeDragSection = activeId ? sections.find((s) => s.id === activeId) : null;
  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="flex flex-col h-full bg-gray-900/50 border-r border-gray-800">
      {/* Compact Header */}
      <div className="px-2 py-2 border-b border-gray-800 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">Sections</span>
        <span className="text-[10px] text-gray-600">{enabledCount}/{sections.length}</span>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-0.5">
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onToggle={() => handleToggle(section.id)}
                  onClick={() => onSectionClick(section.id)}
                  isPremium={premiumFeatureIds.includes(section.id)}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeDragSection ? <DragOverlayContent section={activeDragSection} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Compact Quick Actions */}
      <div className="px-1.5 py-1.5 border-t border-gray-800 flex gap-1">
        <button
          onClick={() => onSectionsChange(sections.map((s) => ({ ...s, enabled: true })))}
          className="flex-1 px-2 py-1 text-[10px] bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 transition-colors"
        >
          All
        </button>
        <button
          onClick={() => onSectionsChange(sections.map((s) => ({ ...s, enabled: false })))}
          className="flex-1 px-2 py-1 text-[10px] bg-gray-800 text-gray-500 rounded hover:bg-gray-700 transition-colors"
        >
          None
        </button>
      </div>
    </div>
  );
}
