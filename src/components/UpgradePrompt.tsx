'use client';

interface UpgradePromptProps {
  reason: string;
  feature?: string;
  onUpgrade?: () => void;
}

export default function UpgradePrompt({ reason, feature, onUpgrade }: UpgradePromptProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mx-auto mb-4">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">Upgrade Required</h3>

        {feature && (
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            <span className="font-semibold">{feature}</span> is not available on your current plan.
          </p>
        )}

        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">{reason}</p>

        <div className="flex gap-3">
          <button
            onClick={onUpgrade}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Plans
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
