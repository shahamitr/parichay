'use client';

import { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';

interface Executive {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface AssignExecutiveModalProps {
  branchId: string;
  branchName: string;
  currentExecutiveId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignExecutiveModal({
  branchId,
  branchName,
  currentExecutiveId,
  isOpen,
  onClose,
  onSuccess,
}: AssignExecutiveModalProps) {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string | null>(
    currentExecutiveId || null
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen != null) {
      fetchExecutives();
    }
  }, [isOpen]);

  const fetchExecutives = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all executives
      const response = await fetch('/api/users?role=EXECUTIVE');

      if (!response.ok) {
        throw new Error('Failed to fetch executives');
      }

      const result = await response.json();

      if (result.success) {
        setExecutives(result.data.users || []);
      } else {
        throw new Error(result.error || 'Failed to load executives');
      }
    } catch (err) {
      console.error('Error fetching executives:', err);
      setError(err instanceof Error ? err.message : 'Failed to load executives');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedExecutiveId) {
      setError('Please select an executive');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/branches/${branchId}/assign-executive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          executiveId: selectedExecutiveId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to assign executive');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error assigning executive:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign executive');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/branches/${branchId}/assign-executive`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to remove executive');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error removing executive:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove executive');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Assign Executive to Branch
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Branch: <span className="font-semibold text-gray-900 dark:text-white">{branchName}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : executives.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No executives available</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Create executive users first to assign them to branches
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Executive
              </label>
              {executives.map((exec) => (
                <button
                  key={exec.id}
                  onClick={() => setSelectedExecutiveId(exec.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${selectedExecutiveId === exec.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedExecutiveId === exec.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                      >
                        {exec.firstName.charAt(0)}
                        {exec.lastName.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {exec.firstName} {exec.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{exec.email}</p>
                        {exec.phone && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{exec.phone}</p>
                        )}
                      </div>
                    </div>
                    {selectedExecutiveId === exec.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div>
            {currentExecutiveId && (
              <button
                onClick={handleRemove}
                disabled={submitting}
                className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium disabled:opacity-50"
              >
                Remove Assignment
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={submitting || !selectedExecutiveId || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Assigning...' : 'Assign Executive'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
