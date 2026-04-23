'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Building2,
  User,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Edit3,
  Eye,
  QrCode,
  Link2,
  Mail,
  Phone,
  Calendar,
  Filter,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';

// =============================================================================
// TYPES
// =============================================================================
type ActivityType =
  | 'branch_created'
  | 'branch_updated'
  | 'branch_activated'
  | 'branch_deactivated'
  | 'lead_received'
  | 'qr_scanned'
  | 'link_clicked'
  | 'contact_viewed'
  | 'message_sent'
  | 'call_made'
  | 'note_added'
  | 'status_changed';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date | string;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    branchName?: string;
    branchId?: string;
    leadName?: string;
    oldStatus?: string;
    newStatus?: string;
    [key: string]: unknown;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
  showFilters?: boolean;
  maxItems?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// =============================================================================
// ACTIVITY CONFIG
// =============================================================================
const activityConfig: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  branch_created: {
    icon: <Building2 className="w-4 h-4" />,
    color: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-100 dark:bg-success-900/30',
  },
  branch_updated: {
    icon: <Edit3 className="w-4 h-4" />,
    color: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
  },
  branch_activated: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-100 dark:bg-success-900/30',
  },
  branch_deactivated: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-error-600 dark:text-error-400',
    bgColor: 'bg-error-100 dark:bg-error-900/30',
  },
  lead_received: {
    icon: <User className="w-4 h-4" />,
    color: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
  },
  qr_scanned: {
    icon: <QrCode className="w-4 h-4" />,
    color: 'text-accent-600 dark:text-accent-400',
    bgColor: 'bg-accent-100 dark:bg-accent-900/30',
  },
  link_clicked: {
    icon: <Link2 className="w-4 h-4" />,
    color: 'text-accent-600 dark:text-accent-400',
    bgColor: 'bg-accent-100 dark:bg-accent-900/30',
  },
  contact_viewed: {
    icon: <Eye className="w-4 h-4" />,
    color: 'text-neutral-600 dark:text-neutral-400',
    bgColor: 'bg-neutral-100 dark:bg-neutral-700',
  },
  message_sent: {
    icon: <Mail className="w-4 h-4" />,
    color: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
  },
  call_made: {
    icon: <Phone className="w-4 h-4" />,
    color: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-100 dark:bg-success-900/30',
  },
  note_added: {
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-warning-600 dark:text-warning-400',
    bgColor: 'bg-warning-100 dark:bg-warning-900/30',
  },
  status_changed: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-accent-600 dark:text-accent-400',
    bgColor: 'bg-accent-100 dark:bg-accent-900/30',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
function groupActivitiesByDate(activities: Activity[]): Map<string, Activity[]> {
  const groups = new Map<string, Activity[]>();

  activities.forEach((activity) => {
    const date = typeof activity.timestamp === 'string'
      ? new Date(activity.timestamp)
      : activity.timestamp;

    let groupKey: string;
    if (isToday(date)) {
      groupKey = 'Today';
    } else if (isYesterday(date)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(date)) {
      groupKey = 'This Week';
    } else {
      groupKey = format(date, 'MMMM d, yyyy');
    }

    const existing = groups.get(groupKey) || [];
    existing.push(activity);
    groups.set(groupKey, existing);
  });

  return groups;
}

function formatActivityTime(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return formatDistanceToNow(date, { addSuffix: true });
}

// =============================================================================
// ACTIVITY ITEM COMPONENT
// =============================================================================
interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const config = activityConfig[activity.type];

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
        config.bgColor
      )}>
        <span className={config.color}>{config.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              {activity.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
              )}
              {activity.metadata?.branchName && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                  <Building2 className="w-3 h-3" />
                  {activity.metadata.branchName}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatActivityTime(activity.timestamp)}
            </span>
          </div>

          {/* User info */}
          {activity.user && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              {activity.user.avatar ? (
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-500" />
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ACTIVITY FILTER
// =============================================================================
interface ActivityFilterProps {
  selectedTypes: ActivityType[];
  onChange: (types: ActivityType[]) => void;
}

function ActivityFilter({ selectedTypes, onChange }: ActivityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const typeGroups = {
    'Branch Activity': ['branch_created', 'branch_updated', 'branch_activated', 'branch_deactivated'],
    'Engagement': ['lead_received', 'qr_scanned', 'link_clicked', 'contact_viewed'],
    'Communication': ['message_sent', 'call_made', 'note_added', 'status_changed'],
  } as const;

  const toggleType = (type: ActivityType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
          selectedTypes.length > 0
            ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
        )}
      >
        <Filter className="w-4 h-4" />
        Filter
        {selectedTypes.length > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
            {selectedTypes.length}
          </span>
        )}
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-2 max-h-80 overflow-auto">
            {Object.entries(typeGroups).map(([group, types]) => (
              <div key={group}>
                <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group}
                </p>
                {types.map((type) => {
                  const config = activityConfig[type as ActivityType];
                  const isSelected = selectedTypes.includes(type as ActivityType);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type as ActivityType)}
                      className={cn(
                        'w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700',
                        isSelected && 'bg-blue-50 dark:bg-blue-900/20'
                      )}
                    >
                      <span className={cn('p-1 rounded', config.bgColor, config.color)}>
                        {config.icon}
                      </span>
                      <span className={cn(
                        'flex-1',
                        isSelected ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            ))}
            {selectedTypes.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2 mt-2">
                <button
                  onClick={() => onChange([])}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// MAIN ACTIVITY TIMELINE
// =============================================================================
export function ActivityTimeline({
  activities,
  loading = false,
  showFilters = true,
  maxItems,
  onLoadMore,
  hasMore = false,
}: ActivityTimelineProps) {
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);

  // Filter activities
  const filteredActivities = selectedTypes.length > 0
    ? activities.filter((a) => selectedTypes.includes(a.type))
    : activities;

  // Limit activities if maxItems is set
  const displayActivities = maxItems
    ? filteredActivities.slice(0, maxItems)
    : filteredActivities;

  // Group by date
  const groupedActivities = groupActivitiesByDate(displayActivities);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Activity Timeline
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredActivities.length} activities
            {selectedTypes.length > 0 && ' (filtered)'}
          </p>
        </div>

        {showFilters && (
          <ActivityFilter
            selectedTypes={selectedTypes}
            onChange={setSelectedTypes}
          />
        )}
      </div>

      {/* Timeline */}
      {displayActivities.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {selectedTypes.length > 0
              ? 'No activities match your filter'
              : 'No activity yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedActivities.entries()).map(([date, items]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {date}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Activities for this date */}
              <div className="space-y-0">
                {items.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isLast={index === items.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            Load more activities
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPACT ACTIVITY LIST (for widgets)
// =============================================================================
interface CompactActivityListProps {
  activities: Activity[];
  maxItems?: number;
  onViewAll?: () => void;
}

export function CompactActivityList({
  activities,
  maxItems = 5,
  onViewAll,
}: CompactActivityListProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h4>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {displayActivities.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No recent activity
          </div>
        ) : (
          displayActivities.map((activity) => {
            const config = activityConfig[activity.type];
            return (
              <div
                key={activity.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex-shrink-0 p-1.5 rounded-lg',
                    config.bgColor
                  )}>
                    <span className={config.color}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatActivityTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ActivityTimeline;
