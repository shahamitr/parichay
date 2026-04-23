'use client';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Standardized Toggle/Switch component for consistent enable/disable controls
 * across all section editors in the microsite dashboard
 */
export default function Toggle({
  enabled,
  onChange,
  label = 'Enabled',
  description,
  size = 'md',
  className = '',
}: ToggleProps) {
  const sizeClasses = {
    sm: { track: 'w-9 h-5', thumb: 'h-4 w-4', translate: 'peer-checked:after:translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'h-5 w-5', translate: 'peer-checked:after:translate-x-full' },
    lg: { track: 'w-14 h-7', thumb: 'h-6 w-6', translate: 'peer-checked:after:translate-x-full' },
  };

  const { track, thumb, translate } = sizeClasses[size];

  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`${track} bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer ${translate} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:${thumb} after:transition-all peer-checked:bg-amber-500`}
      ></div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}
