'use client';

import { Clock } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';

interface BusinessHoursConfig {
  [day: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

interface BusinessHoursEditorProps {
  config: BusinessHoursConfig;
  onChange: (config: BusinessHoursConfig) => void;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_HOURS = {
  open: '09:00',
  close: '18:00',
  closed: false,
};

export default function BusinessHoursEditor({ config, onChange }: BusinessHoursEditorProps) {
  const getHours = (day: string) => {
    return config[day] || DEFAULT_HOURS;
  };

  const updateDay = (day: string, field: string, value: any) => {
    onChange({
      ...config,
      [day]: {
        ...getHours(day),
        [field]: value,
      },
    });
  };

  const copyToAll = (sourceDay: string) => {
    const sourceHours = getHours(sourceDay);
    const newConfig: BusinessHoursConfig = {};
    DAYS.forEach(({ key }) => {
      newConfig[key] = { ...sourceHours };
    });
    onChange(newConfig);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Clock className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Business Hours</h3>
          <p className="text-sm text-gray-400">Set your operating hours for each day</p>
        </div>
      </div>

      <div className="space-y-3">
        {DAYS.map(({ key, label }) => {
          const hours = getHours(key);
          return (
            <div
              key={key}
              className={`p-4 rounded-xl border transition-all ${
                hours.closed
                  ? 'bg-gray-900/30 border-gray-800'
                  : 'bg-gray-900/50 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-24 font-medium text-white">{label}</span>

                  {!hours.closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateDay(key, 'open', e.target.value)}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateDay(key, 'close', e.target.value)}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  )}

                  {hours.closed && (
                    <span className="text-gray-500 text-sm">Closed</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyToAll(key)}
                    className="text-xs text-amber-500 hover:text-amber-400 px-2 py-1"
                    title="Copy to all days"
                  >
                    Copy to all
                  </button>
                  <Toggle
                    enabled={!hours.closed}
                    onChange={(open) => updateDay(key, 'closed', !open)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Presets */}
      <div className="pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-400 mb-3">Quick Presets:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const preset: BusinessHoursConfig = {};
              DAYS.forEach(({ key }) => {
                preset[key] = key === 'sunday'
                  ? { open: '09:00', close: '18:00', closed: true }
                  : { open: '09:00', close: '18:00', closed: false };
              });
              onChange(preset);
            }}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
          >
            Mon-Sat 9-6
          </button>
          <button
            onClick={() => {
              const preset: BusinessHoursConfig = {};
              DAYS.forEach(({ key }) => {
                preset[key] = key === 'saturday' || key === 'sunday'
                  ? { open: '09:00', close: '18:00', closed: true }
                  : { open: '09:00', close: '17:00', closed: false };
              });
              onChange(preset);
            }}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
          >
            Mon-Fri 9-5
          </button>
          <button
            onClick={() => {
              const preset: BusinessHoursConfig = {};
              DAYS.forEach(({ key }) => {
                preset[key] = { open: '00:00', close: '23:59', closed: false };
              });
              onChange(preset);
            }}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
          >
            24/7
          </button>
          <button
            onClick={() => {
              const preset: BusinessHoursConfig = {};
              DAYS.forEach(({ key }) => {
                preset[key] = { open: '10:00', close: '22:00', closed: false };
              });
              onChange(preset);
            }}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
          >
            10 AM - 10 PM
          </button>
        </div>
      </div>
    </div>
  );
}
