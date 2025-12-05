'use client';

import { useMemo } from 'react';

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
  fill?: boolean;
}

export default function MiniChart({
  data,
  color = '#3B82F6',
  height = 40,
  width = 100,
  strokeWidth = 2,
  fill = false,
}: MiniChartProps) {
  const path = useMemo(() => {
    if (data.length === 0) return '';

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  const fillPath = useMemo(() => {
    if (!fill || data.length === 0) return '';
    return `${path} L ${width},${height} L 0,${height} Z`;
  }, [path, fill, width, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {fill && (
        <path
          d={fillPath}
          fill={color}
          fillOpacity="0.1"
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Area Chart variant
export function MiniAreaChart({ data, color = '#3B82F6', height = 40, width = 100 }: MiniChartProps) {
  return <MiniChart data={data} color={color} height={height} width={width} fill />;
}

// Bar Chart variant
export function MiniBarChart({ data, color = '#3B82F6', height = 40, width = 100 }: MiniChartProps) {
  const max = Math.max(...data);
  const barWidth = width / data.length - 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((value, index) => {
        const barHeight = (value / max) * height;
        const x = index * (width / data.length);
        const y = height - barHeight;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={color}
            rx={2}
          />
        );
      })}
    </svg>
  );
}
