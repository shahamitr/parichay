'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import VerifiedBadge, { CompletionScoreBadge } from '@/components/ui/VerifiedBadge';

interface BranchVerificationCardProps {
  branchId: string;
  branchName: string;
  onVerificationChange?: () => void;
}

export default function BranchVerificationCard({
  branchId,
  branchName,
  onVerificationChange,
}: BranchVerificationCardProps) {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerificationStatus();
  }, [branchId]);

  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/branches/${branchId}/verify`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setError('');

      const response = await fetch(`/api/branches/${branchId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        await fetchVerificationStatus();
        setNotes('');
        if (onVerificationChange != null) {
          onVerificationChange();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to verify branch');
      }
    } catch (error) {
      setError('An error occurred while verifying');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading != null) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Business Verification
          </h3>
          <p className="text-sm text-gray-600">
            Verify that all business information is complete and accurate
          </p>
        </div>
        {status.isVerified && (
          <VerifiedBadge type="verified" size="md" showLabel={true} />
        )}
      </div>

      {/* Completion Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Profile Completion
          </span>
          <CompletionScoreBadge score={status.completionScore} size="md" />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              status.completionScore >= 80
                ? 'bg-green-600'
                : status.completionScore >= 60
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${status.completionScore}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          {status.completionScore >= 80
            ? 'Ready for verification'
            : `${status.requiredScore - status.completionScore}% more needed for verification`}
        </p>
      </div>

      {/* Missing Fields */}
      {status.missingFields && status.missingFields.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                Missing Information
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {status.missingFields.map((field: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Verification Status */}
      {status.isVerified ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-900 mb-1">
                Verified Business
              </h4>
              <p className="text-sm text-green-800">
                This business has been verified and displays a verified badge on its
                microsite.
              </p>
              {status.verifiedAt && (
                <p className="text-xs text-green-700 mt-2">
                  Verified on {new Date(status.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : status.canVerify ? (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Ready for Verification
                </h4>
                <p className="text-sm text-blue-800">
                  This business meets all requirements and can be verified.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this verification..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verify Business</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            Complete the missing information above to enable verification.
          </p>
        </div>
      )}
    </div>
  );
}
