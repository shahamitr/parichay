'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TimePickerProps {
  value: string; // HH:MM format (24h)
  onChange: (time: string) => void;
  label?: string;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function formatDisplay(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

export function TimePicker({ value, onChange, label, className }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-left hover:border-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <Clock className="w-4 h-4 text-gray-400" />
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value ? formatDisplay(value) : 'Select time'}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-[200px] max-h-[240px] overflow-y-auto">
          {HOURS.map((hour) =>
            MINUTES.map((minute) => {
              const timeStr = formatTime(hour, minute);
              const isSelected = timeStr === value;
              return (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => { onChange(timeStr); setOpen(false); }}
                  className={cn(
                    'w-full px-3 py-1.5 text-left text-xs rounded-md transition-colors',
                    isSelected ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {formatDisplay(timeStr)}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
