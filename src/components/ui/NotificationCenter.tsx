'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Settings,
  Trash2,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// =============================================================================
// TYPES
// =============================================================================
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date | string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  maxHeight?: string;
  className?: string;
}

// =============================================================================
// NOTIFICATION ICON MAP
// =============================================================================
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="w-5 h-5 text-primary-500" />,
  success: <CheckCircle className="w-5 h-5 text-success-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning-500" />,
  error: <AlertCircle className="w-5 h-5 text-error-500" />,
  message: <MessageSquare className="w-5 h-5 text-accent-500" />,
};

const notificationBgColors: Record<NotificationType, string> = {
  info: 'bg-primary-50 dark:bg-primary-900/20',
  success: 'bg-success-50 dark:bg-success-900/20',
  warning: 'bg-warning-50 dark:bg-warning-900/20',
  error: 'bg-error-50 dark:bg-error-900/20',
  message: 'bg-accent-50 dark:bg-accent-900/20',
};

// =============================================================================
// NOTIFICATION BELL BUTTON
// =============================================================================
interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  className?: string;
}

export function NotificationBell({ unreadCount, onClick, className }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
        'dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-bold text-white bg-error-500 rounded-full px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}

// =============================================================================
// NOTIFICATION CENTER DROPDOWN
// =============================================================================
export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onNotificationClick,
  maxHeight = '400px',
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <NotificationBell unreadCount={unreadCount} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'text-sm pb-1 border-b-2 transition-colors',
                  filter === 'all'
                    ? 'border-primary-600 text-primary-600 font-medium'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'text-sm pb-1 border-b-2 transition-colors flex items-center gap-1',
                  filter === 'unread'
                    ? 'border-primary-600 text-primary-600 font-medium'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                )}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => onMarkAsRead(notification.id)}
                    onDelete={onDelete ? () => onDelete(notification.id) : undefined}
                    onClick={() => {
                      onNotificationClick?.(notification);
                      if (!notification.isRead) {
                        onMarkAsRead(notification.id);
                      }
                    }}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    // Navigate to all notifications page
                    window.location.href = '/admin/notifications';
                    setIsOpen(false);
                  }}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View all notifications
                </button>
                {onClearAll && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-neutral-500 hover:text-error-600 dark:text-neutral-400 dark:hover:text-error-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// NOTIFICATION ITEM
// =============================================================================
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  formatTime: (timestamp: Date | string) => string;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  formatTime,
}: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cn(
        'relative px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer',
        !notification.isRead && 'bg-primary-50/50 dark:bg-primary-900/10'
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            notificationBgColors[notification.type]
          )}
        >
          {notificationIcons[notification.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                'text-sm',
                notification.isRead
                  ? 'text-neutral-700 dark:text-neutral-300'
                  : 'text-neutral-900 dark:text-white font-medium'
              )}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-1.5" />
            )}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-neutral-400">
              {formatTime(notification.timestamp)}
            </span>
            {notification.actionLabel && notification.actionUrl && (
              <a
                href={notification.actionUrl}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {notification.actionLabel}
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div
            className="absolute right-3 top-3 flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {!notification.isRead && (
              <button
                onClick={onMarkAsRead}
                className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                title="Mark as read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-neutral-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TOAST WITH UNDO ACTION
// =============================================================================
interface UndoToastProps {
  message: string;
  onUndo: () => void;
  duration?: number;
  onClose: () => void;
}

export function UndoToast({ message, onUndo, duration = 5000, onClose }: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-neutral-900 dark:bg-neutral-800 text-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-4">
          <span className="text-sm">{message}</span>
          <button
            onClick={() => {
              onUndo();
              onClose();
            }}
            className="text-sm font-medium text-primary-400 hover:text-primary-300"
          >
            Undo
          </button>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-neutral-700">
          <div
            className="h-full bg-primary-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// NOTIFICATION SETTINGS
// =============================================================================
interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreference[];
  onUpdate: (id: string, field: 'email' | 'push' | 'inApp', value: boolean) => void;
}

export function NotificationSettings({ preferences, onUpdate }: NotificationSettingsProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Notification Preferences
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                Notification Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase w-24">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase w-24">
                Push
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase w-24">
                In-App
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {preferences.map((pref) => (
              <tr key={pref.id}>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {pref.label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {pref.description}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={pref.email}
                    onChange={(e) => onUpdate(pref.id, 'email', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={pref.push}
                    onChange={(e) => onUpdate(pref.id, 'push', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={pref.inApp}
                    onChange={(e) => onUpdate(pref.id, 'inApp', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationCenter;
