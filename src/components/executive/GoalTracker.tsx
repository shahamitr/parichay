'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Trophy,
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================
interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startDate: string;
  endDate: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  category: 'onboarding' | 'activation' | 'support' | 'other';
}

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal?: () => void;
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (id: string) => void;
  onUpdateProgress?: (id: string, newValue: number) => void;
  loading?: boolean;
  canManage?: boolean;
}

// =============================================================================
// STATUS CONFIG
// =============================================================================
const statusConfig = {
  on_track: {
    label: 'On Track',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  at_risk: {
    label: 'At Risk',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  behind: {
    label: 'Behind',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  completed: {
    label: 'Completed',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: <Check className="w-4 h-4" />,
  },
};

const periodLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

const categoryColors = {
  onboarding: 'bg-purple-500',
  activation: 'bg-green-500',
  support: 'bg-blue-500',
  other: 'bg-gray-500',
};

// =============================================================================
// GOAL CARD COMPONENT
// =============================================================================
interface GoalCardProps {
  goal: Goal;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdateProgress?: (newValue: number) => void;
  canManage?: boolean;
}

function GoalCard({ goal, onEdit, onDelete, onUpdateProgress, canManage }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.current.toString());

  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const status = statusConfig[goal.status];
  const daysRemaining = Math.ceil(
    (new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const handleSaveProgress = () => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      onUpdateProgress?.(newValue);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-1 h-12 rounded-full', categoryColors[goal.category])} />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {goal.title}
            </h4>
            {goal.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {goal.description}
              </p>
            )}
          </div>
        </div>
        <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-20 px-2 py-1 text-lg font-bold border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max={goal.target}
                />
                <button
                  onClick={handleSaveProgress}
                  className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditValue(goal.current.toString());
                    setIsEditing(false);
                  }}
                  className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span
                  className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600"
                  onClick={() => onUpdateProgress && setIsEditing(true)}
                  title="Click to update"
                >
                  {goal.current}
                </span>
                <span className="text-sm text-gray-400">
                  / {goal.target} {goal.unit}
                </span>
              </>
            )}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {progress.toFixed(0)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              goal.status === 'completed' ? 'bg-blue-500' :
              goal.status === 'on_track' ? 'bg-green-500' :
              goal.status === 'at_risk' ? 'bg-yellow-500' :
              'bg-red-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {periodLabels[goal.period]}
          </span>
          {daysRemaining > 0 ? (
            <span className={cn(
              'flex items-center gap-1',
              daysRemaining <= 3 ? 'text-red-500' : daysRemaining <= 7 ? 'text-yellow-500' : ''
            )}>
              {daysRemaining} days left
            </span>
          ) : (
            <span className="text-gray-400">Ended</span>
          )}
        </div>

        {canManage && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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
// GOAL SUMMARY WIDGET
// =============================================================================
interface GoalSummaryProps {
  goals: Goal[];
}

export function GoalSummary({ goals }: GoalSummaryProps) {
  const completed = goals.filter((g) => g.status === 'completed').length;
  const onTrack = goals.filter((g) => g.status === 'on_track').length;
  const atRisk = goals.filter((g) => g.status === 'at_risk').length;
  const behind = goals.filter((g) => g.status === 'behind').length;
  const total = goals.length;

  const overallProgress = total > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / total)
    : 0;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Trophy className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-lg">Goals Overview</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-white/70 text-sm">Overall Progress</p>
          <p className="text-3xl font-bold">{overallProgress}%</p>
        </div>
        <div>
          <p className="text-white/70 text-sm">Completed</p>
          <p className="text-3xl font-bold">{completed}/{total}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            On Track
          </span>
          <span>{onTrack}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            At Risk
          </span>
          <span>{atRisk}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            Behind
          </span>
          <span>{behind}</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN GOAL TRACKER
// =============================================================================
export function GoalTracker({
  goals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onUpdateProgress,
  loading = false,
  canManage = true,
}: GoalTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active') return goal.status !== 'completed';
    if (filter === 'completed') return goal.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-blue-500" />
            Goal Tracker
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your performance goals and achievements
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  filter === f
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {canManage && onAddGoal && (
            <button
              onClick={onAddGoal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          )}
        </div>
      </div>

      {/* Goal Summary and Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Card */}
        <div className="lg:col-span-1">
          <GoalSummary goals={goals} />
        </div>

        {/* Goals Grid */}
        <div className="lg:col-span-3">
          {filteredGoals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                No goals yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all'
                  ? 'Start tracking your performance by adding your first goal.'
                  : `No ${filter} goals found.`}
              </p>
              {canManage && onAddGoal && filter === 'all' && (
                <button
                  onClick={onAddGoal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Goal
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={onEditGoal ? () => onEditGoal(goal) : undefined}
                  onDelete={onDeleteGoal ? () => onDeleteGoal(goal.id) : undefined}
                  onUpdateProgress={onUpdateProgress ? (v) => onUpdateProgress(goal.id, v) : undefined}
                  canManage={canManage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalTracker;
