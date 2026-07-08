'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, TrendingUp, Users } from 'lucide-react';

interface HourData {
  hour: number; // 0-23
  level: 'quiet' | 'moderate' | 'busy';
  label?: string;
}

interface BestTimeToVisitProps {
  data: HourData[];
  primaryColor?: string;
  businessName?: string;
  timezone?: string;
}

const LEVEL_COLORS = {
  quiet: { bg: '#D1FAE5', text: '#065F46', label: 'Quiet' },
  moderate: { bg: '#FEF3C7', text: '#92400E', label: 'Moderate' },
  busy: { bg: '#FEE2E2', text: '#991B1B', label: 'Busy' },
};

const LEVEL_HEIGHTS = {
  quiet: 'h-6',
  moderate: 'h-10',
  busy: 'h-16',
};

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function formatHourShort(hour: number): string {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  if (hour < 12) return `${hour}a`;
  return `${hour - 12}p`;
}

export default function BestTimeToVisit({
  data,
  primaryColor = '#4F46E5',
  businessName,
  timezone,
}: BestTimeToVisitProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  if (!data || data.length === 0) return null;

  // Sort by hour
  const sortedData = [...data].sort((a, b) => a.hour - b.hour);

  // Find best time (quiet hours during reasonable visiting hours 8am-8pm)
  const bestTimes = sortedData.filter(
    (d) => d.level === 'quiet' && d.hour >= 8 && d.hour <= 20
  );

  return (
    <section ref={containerRef} className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <Clock className="w-4 h-4" />
            Best Time to Visit
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {businessName ? `When to Visit ${businessName}` : 'Popular Times'}
          </h2>
          <p className="text-sm text-gray-500">
            Based on visitor traffic patterns
            {timezone && ` (${timezone})`}
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-6 mb-6"
        >
          {Object.entries(LEVEL_COLORS).map(([level, config]) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: config.bg, border: `1px solid ${config.text}30` }}
              />
              <span className="text-xs font-medium text-gray-600">{config.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Traffic Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-end justify-between gap-1 h-24">
            {sortedData.map((hourData, index) => {
              const colors = LEVEL_COLORS[hourData.level];
              return (
                <motion.div
                  key={hourData.hour}
                  className="flex-1 flex flex-col items-center gap-1"
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.03 }}
                  style={{ transformOrigin: 'bottom' }}
                >
                  {/* Bar */}
                  <div className="relative group w-full flex justify-center">
                    <div
                      className={`w-full max-w-[20px] rounded-t-md ${LEVEL_HEIGHTS[hourData.level]} transition-all cursor-pointer hover:opacity-80`}
                      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.text}20` }}
                      title={`${formatHour(hourData.hour)}: ${colors.label}`}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {formatHour(hourData.hour)} — {colors.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Hour labels */}
          <div className="flex items-center justify-between gap-1 mt-2 border-t border-gray-100 pt-2">
            {sortedData.map((hourData) => (
              <div
                key={`label-${hourData.hour}`}
                className="flex-1 text-center"
              >
                <span className="text-[9px] text-gray-400 font-medium">
                  {hourData.hour % 3 === 0 ? formatHourShort(hourData.hour) : ''}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best time recommendation */}
        {bestTimes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4"
          >
            <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Best time to visit
              </p>
              <p className="text-sm text-emerald-700 mt-0.5">
                {bestTimes.slice(0, 3).map((t) => formatHour(t.hour)).join(', ')}
                {' '}— least crowded
              </p>
            </div>
          </motion.div>
        )}

        {/* Current status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-4 text-center"
        >
          {(() => {
            const currentHour = new Date().getHours();
            const currentData = sortedData.find((d) => d.hour === currentHour);
            if (!currentData) return null;
            const colors = LEVEL_COLORS[currentData.level];
            return (
              <div className="inline-flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Right now:</span>
                <span
                  className="font-semibold px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {colors.label}
                </span>
              </div>
            );
          })()}
        </motion.div>
      </div>
    </section>
  );
}
