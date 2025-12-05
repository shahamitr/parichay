'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Animated Bar Chart
export function BarChart({
  data,
  height = 200,
  showValues = true,
  animated = true,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
  animated?: boolean;
}) {
  const [animatedData, setAnimatedData] = useState(data.map((d) => ({ ...d, value: 0 })));
  const maxValue = Math.max(...data.map((d) => d.value));

  useEffect(() => {
    if (animated != null) {
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, animated]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
        {animatedData.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex items-end justify-center" style={{ height: '100%' }}>
                {showValues && item.value > 0 && (
                  <span className="absolute -top-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {item.value}
                  </span>
                )}
                <div
                  className={cn(
                    'w-full rounded-t-lg transition-all duration-1000 ease-out',
                    item.color || 'bg-blue-500'
                  )}
                  style={{ height: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Animated Line Chart
export function LineChart({
  data,
  height = 200,
  color = 'blue',
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const [progress, setProgress] = useState(0);
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ height: `${height}px` }}
        className="w-full"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-300 dark:text-gray-700"
          />
        ))}

        {/* Area fill */}
        <path
          d={`${pathD} L 100,100 L 0,100 Z`}
          fill={`url(#gradient-${color})`}
          className="transition-all duration-1000"
          style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-${color}-500 transition-all duration-1000`}
          style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
        />

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value - minValue) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="currentColor"
              className={`text-${color}-600 transition-all duration-1000`}
              style={{
                opacity: progress / 100,
                transitionDelay: `${index * 50}ms`,
              }}
            />
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className={`text-${color}-500`} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={`text-${color}-500`} />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

// Donut Chart
export function DonutChart({
  data,
  size = 200,
  thickness = 30,
  showLegend = true,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  let currentAngle = -90;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const segmentLength = (circumference * percentage) / 100;
          const offset = circumference - (segmentLength * progress) / 100;
          const angle = currentAngle;
          currentAngle += (360 * percentage) / 100;

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={thickness}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${angle}deg)`,
                transitionDelay: `${index * 100}ms`,
              }}
            />
          );
        })}

        {/* Center text */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-current text-gray-900 dark:text-white transform rotate-90"
          style={{ transformOrigin: 'center' }}
        >
          {total}
        </text>
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Stat Card with Trend
export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, ''));

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        setAnimatedValue(Math.floor(numericValue * easeOutQuad));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [value, numericValue]);

  return (
    <div className={cn(
      'p-6 rounded-xl border transition-all duration-300 hover:shadow-lg',
      `bg-${color}-50 dark:bg-${color}-900/10 border-${color}-200 dark:border-${color}-800`
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'p-3 rounded-lg',
          `bg-${color}-100 dark:bg-${color}-900/30`
        )}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
            trend === 'up' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            trend === 'down' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
            trend === 'neutral' && 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
          )}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'neutral' && <Minus className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className={cn(
        'text-3xl font-bold',
        `text-${color}-700 dark:text-${color}-300`
      )}>
        {typeof value === 'number' ? animatedValue.toLocaleString() : value}
      </p>
    </div>
  );
}

// Heatmap
export function Heatmap({
  data,
  rows,
  cols,
}: {
  data: number[][];
  rows: string[];
  cols: string[];
}) {
  const maxValue = Math.max(...data.flat());

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${cols.length}, 1fr)` }}>
        {/* Header row */}
        <div />
        {cols.map((col, i) => (
          <div key={i} className="text-xs text-center text-gray-600 dark:text-gray-400 p-2">
            {col}
          </div>
        ))}

        {/* Data rows */}
        {data.map((row, rowIndex) => (
          <>
            <div key={`label-${rowIndex}`} className="text-xs text-gray-600 dark:text-gray-400 p-2 flex items-center">
              {rows[rowIndex]}
            </div>
            {row.map((value, colIndex) => {
              const intensity = (value / maxValue) * 100;
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square rounded transition-all duration-300 hover:scale-110 cursor-pointer group relative"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${intensity / 100})`,
                  }}
                  title={`${rows[rowIndex]} - ${cols[colIndex]}: ${value}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {value}
                  </span>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
